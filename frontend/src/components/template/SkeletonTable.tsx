import { Skeleton } from "../ui/skeleton"

export const SkeletonTable = () => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-4 py-2">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-4 py-2">
                <Skeleton className="h-4 w-32" />
              </th>
              <th className="px-4 py-2">
                <Skeleton className="h-4 w-32" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index}>
                <td className="px-4 py-2">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-2">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-2">
                  <Skeleton className="h-4 w-32" />
                </td>
                <td className="px-4 py-2">
                  <Skeleton className="h-4 w-32" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
    )
}