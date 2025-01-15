### Aplicación de agenda DEVOPS ### 

#### Creación de archivos dockerfile  en carpetas backend / frontend ##### 

 >**backend**

~~~yaml 
# dockerfile 
FROM node:19-alpine3.15
WORKDIR /app
COPY package.json ./packaje.json
RUN npm install --forzen-lockfile
COPY . .
RUN npm install -g nodemon
EXPOSE 3000
CMD [ "npm", "run", "dev" ]
~~~

>**Frontend**

~~~yaml
# dockerfile
FROM node:hydrogen-slim 
WORKDIR /app
COPY package.json ./package.jon
RUN npm install --forzen-lockfile
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]
~~~

>**Docker compose**

Desde la raiz de la carpeta diseñamos nuestro docker compose para crear los servicios necesario que requiere nuestra aplicación.  La aplicaicón debe contar con 

- [x]  La imagen que se creara  del backend
- [x]  La imagen que se creara del frontend
- [x]  La imagen de postres 
- [x]  La imagen de redis

~~~yaml
services:
 # definimos contenedor frontend
  frontend: 
    build: ./frontend
    depends_on:
      - backend
    container_name: agenda-frontend
    image: rbmoises/devops:agenda-frontend-v1
    ports: 
      - ${PORT_FRONT}:${PORT_FRONT}
    volumes:
      - ./frontend/:/app
    env_file:
      - ./frontend/.env
    networks:
      - agenda-app-network

  # definimos contenedor backend
  backend:
    build: ./backend
    depends_on:
      - postgres_db
      - redis_db
    container_name: agenda-backend
    image: rbmoises/devops:agenda-backend-v1
    ports:
      - ${PORT}:${PORT}
    volumes:
      - ./backend:/app
    networks:
      - agenda-app-network
      
  # instalacion base de datos en postgres
  postgres_db:
    image: postgres:17.0
    container_name: ${POSTGRES_HOST}
    environment:
      POSTGRES_HOST: ${POSTGRES_HOST}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    restart: always
    ports:
      - ${POSTGRES_PORT}:${POSTGRES_PORT}
    volumes:
      - ./backend/pg-db/data:/var/lib/postgresql/data
      - ./backend/pg-db/init-db:/docker-entrypoint-initdb.d
    networks:
      - agenda-app-network

# instalación de redis para la gestión de base en cache
  redis_db:
    image: redis:latest
    container_name: ${REDIS_HOST}
    restart: always
    ports:
      - ${REDIS_PORT}:${REDIS_PORT}
    volumes:
      - ./backend/redis-db:/data
    networks:
      - agenda-app-network
    command: ["redis-server", "--appendonly", "yes"]

# networks
networks:
  agenda-app-network:
    external: true
~~~

~~~bash
# Para levantar o correr nuestro contenedores ejecutamos el comando 
docker compose up --build
~~~

Una vez generada las imagenes correspondiente (backend y frontend). Estas deben ser subidas a nuestro repositorio de Docker Hub ya que de esta forma se ocuparán más adelante en la configuración de kubernetes

~~~bash
# comando para subir a subir a docker hub nuestras imagenes.

docker push rbmoises/devops:agenda-backend-v1
docker push rbmoises/devops:agenda-frontend-v1
~~~

### Kubernetes ###

Creamos una carpeta ```kubernetes```en la raiz de nuestro proyecto.  Esta carpeta debe contener todas las configuraciones correspondientes para levantar nuestras imagenes en kubernetes. 

1. Creación de Pods. 

Dentro de la carpeta ```/kubernetes/pods``` encontrarán cada uno de los pods que se definirán acá: 

>**Pod backend**    

Este pod contiene tanto la configuración ```ConfigMap``` para pasar las variables  de entornos necesaria, como la configuración misma del Pod

~~~yaml
# config map backend
apiVersion: v1
kind: ConfigMap
metadata:
  name: agenda-backend-configmap
  namespace: agenda-namespace
data: 
  STAGE: "dev" 
  PORT: "3000"
  URL: "http://localhost:3000"
  POSTGRES_USER: "agenda-u"
  POSTGRES_HOST: "agenda-db-pg"
  POSTGRES_DB: "agenda-db"
  POSTGRES_PASSWORD: "agenda-db"
  POSTGRES_PORT: "5432"
  MAIL_HOST: "sandbox.smtp.mailtrap.io"
  MAIL_PORT: "2525"
  MAIL_USER: "75883cf4e9bba6"
  MAIL_PASS: "4e62f318c3763e"
  JWT_SEED: "s33d1nf0"
  REDIS_HOST: "agenda-db-redis"
  REDIS_PORT: "6379"
---
# pod backend

apiVersion: v1
kind: Pod
metadata: 
  name: agenda-backend-pod
  namespace: agenda-namespace
# especificaciones del contenedor
spec:
  containers:
    - name: agenda-backend-pod-container
      image: rbmoises/devops:agenda-backend-v1
      envFrom:
        - configMapRef:
            name: agenda-backend-configmap
      ports:
        - containerPort: 3000
      resources:
        limits:
          memory: "500Mi"
          cpu: "500m"
~~~

>**Pod frontend**

Al igual que el backend este pod tambien contiene un ```ConfigMap``` para pasar las varibles de entornos necesarias a la aplicación 

~~~yaml
# configmap frontend
apiVersion: v1
kind: ConfigMap
metadata:
  name: agenda-frontend-configmap
  namespace: agenda-namespace
data:
  AUTH_SECRET: "2cX4eVBD3NvjbmNkFmxVnNvlutgP82MlNlEQq8q+Kq8="
  NEXT_PUBLIC_API_URL: "http://agenda-backend:3000"
  NEXT_PUBLIC_API_URL_CLIENT: "http://localhost:3000"
  PORT: "3001"
---
#pod frontend
apiVersion: v1
kind: Pod
metadata:
  name: agenda-frontend-pod
  namespace: agenda-namespace
# especificamos contenedor
spec:
  containers:
    - name: agenda-frontend-pod-container
      image: rbmoises/devops:agenda-frontend-v1
      envFrom: 
        - configMapRef:
            name: agenda-frontend-configmap
      ports:
        - containerPort: 3001
      resources:
        limits:
          cpu: "500m"
          memory: "500Mi"
~~~

>**Pod Postgres**

El Pod posgres es el encargado de levantar nuestra base de datos, este pod tiene configuraciones diferente a las mencionada con anterioridad. Y es que al ser una base de datos se necesita generar persistencia de ellos. Con el fin de que la información no se pierda una vez el pod haya sido destruido

1. Configuración del ```ConfigMap``` para pasar las variables de entornos correspondiente. 
2. Creación de un ```PersistentVolume``` y ```PersistentVolumeClaim```
3. Creación del Pod y asociación del volumen creado con anterioridad.

~~~yaml
# configmap postres db
apiVersion: v1
kind: ConfigMap
metadata:
  name: agenda-postgres-configmap
  namespace: agenda-namespace
data:
  POSTGRES_USER: "agenda-u"
  POSTGRES_HOST: "agenda-db-pg"
  POSTGRES_DB: "agenda-db"
  POSTGRES_PASSWORD: "agenda-db"
  POSTGRES_PORT: "5432"
---

#pv
apiVersion: v1
kind: PersistentVolume
metadata:
  name: agenda-postgres-pv
  namespace: agenda-namespace
spec: 
  capacity:
    storage: 1Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: /Users/XXXXXX/src/devops/agenda-app/backend/pg-db/data

---

#pvc a
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: agenda-postgres-pvc
  namespace: agenda-namespace
spec: 
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
---

# pod postgres db
apiVersion: v1
kind: Pod
metadata:
  name: agenda-postgres-pod
  namespace: agenda-namespace
spec:
  containers:
    - name: agenda-postgres-pod-container
      image: postgres:17.0
      envFrom:
        - configMapRef:
            name: agenda-postgres-configmap
      ports:
        - containerPort: 5432
      resources:
        limits:
          cpu: "128m"
          memory: "128Mi"
      volumeMounts:
        - name: agenda-postgres-data-pvc
          mountPath: /var/lib/postgresql/data
        - name: agenda-postgres-init
          mountPath: /docker-entrypoint-initdb.d
  volumes:
    - name: agenda-postgres-data-pvc
      persistentVolumeClaim:
        claimName: agenda-postgres-pvc
    - name: agenda-postgres-init
      hostPath:
        path: /Users/XXXXXX/src/devops/agenda-app/backend/pg-db/init-db
~~~

>**Pod redis**

Se ocupa una  imagen de redis básica para la creación del Pod, está no se le pasará variables de entornos ni configurar volumenes, por lo que no es necesario configurar ```ConfigMap```y ```PersistentVolume```

~~~yaml
apiVersion: v1
kind: Pod
metadata: 
  name: agenda-redis-pod
  namespace: agenda-namespace
spec: 
  containers:
    - name: agenda-redis-pod-container
      image: redis:alpine
      ports:
        - containerPort: 6379
      resources:
        limits:
          cpu: "128m"
          memory: "128Mi"
~~~

Una vez configurado todos los ```Pods``` correspondiente debemos inicializarlo, para esto debemos ejecutar el siguiente comando, por cada uno de los pods creados. 

~~~bash
kubectl apply -f kubernetes/pods/postgres-pod.yaml
kubectl apply -f kubernetes/pods/redis-pod.yaml
kubectl apply -f kubernetes/pods/backend-pod.yaml
kubectl apply -f kubernetes/pods/frontend-pod.yaml
~~~

Esto creará  los distintos Pod en ```kubernete```, es de recordar que en cada ```Pod``` creado se genero un ```namespace```en el metadata. Esto es importante ya que todas las configuraciones realizadas estarán asociado a este espacio de trabajo.

>**Uso de la herramienta de K9s**

Se utiliza la herramienta K9s para visualizar todo el trabajo realizado de forma más gráfica

1. Espacio de trabajo creado.
![alt text](/assets/image.png)

2. Pods creado de forma éxitosa.
![alt text](/assets/image2.png)



>**Deployment**

Comando 
~~~bash
# en mi caso la carpeta donde tengo los deployment se llama deployment  así que apuntaría a la carpeta en el comando 

kubectl apply -f deployment -n agenda-namespace

# ver los deployment generados
kubectl get deploy -n agenda-namespace

# ver los deployment más las replicasSet
kubectl get deploy,rs -n agenda-namespace

# ver los deployment, replicasSet y pod 
kubectl get deploy,rs,pod -n agenda-namespace

# ver deploymen, replicaSet, pod y service 
kubectl get deploy,rs,pod,svc -n agenda-namespace -o wide  # el tag -o wide es para más detalle
#  ver el historico del deploy
kubectl rollout  history deploy agenda-frontend-deployment -n agenda-namespace

# comando para poder darle salida al servicio
kubectl port-forward  service/agenda-frontend-app 8080:3001 -n agenda-namespace 

# aplicando todos los objetos
kubectl apply -f configmaps -n agenda-namespace 
kubectl apply -f storage -n agenda-namespace 
kubectl apply -f deployments -n agenda-namespace 
kubectl apply -f services -n agenda-namespace 

kubectl delete -f configmaps -n agenda-namespace 
kubectl delete -f deployments -n agenda-namespace 
kubectl delete -f services -n agenda-namespace 
kubectl delete -f storage -n agenda-namespace 

~~~