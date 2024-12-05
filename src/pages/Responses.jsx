import { useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { axiosOpen } from "../utils/axios";

const Responses = () => {
  const { formId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageNo = Number(searchParams.get("page_no") || 1);
  const pageSize = Number(searchParams.get("page_size") || 10);
  const [totalData, setTotalData] = useState(0);

  const [queryCall, setQueryCall] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ["respondents", formId, { page_no: pageNo, page_size: pageSize }],
    queryFn: async () => {
      const { data } = await axiosOpen.get(`/respondents/${formId}`, {
        params: {
          page_no: pageNo,
          page_size: pageSize,
        },
      });

      setTotalData(data.total_data);

      setQueryCall(true);

      return data.data;
    },
    enabled: !queryCall,
  });

  const setPageNo = (newPageNo) =>
    setSearchParams(
      (prev) => {
        prev.set("page_no", newPageNo);
        return prev;
      },
      { replace: true }
    );

  return (
    <section className="p-10 pt-7 max-w-screen-xl mx-auto">
      <div className="flex justify-between items-center border-b border-solid border-b-neutral-300 p-1">
        <h2 className="font-extrabold text-2xl">Respondents</h2>
        <button
          className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 px-4 rounded-lg font-bold"
          onClick={() => navigate(-1, { replace: true })}
        >
          Back
        </button>
      </div>
      <div className="mt-4">
        <table className="table-auto bg-white border-collapse border border-slate-300 w-full">
          <thead>
            <tr>
              <th className="py-4 px-4 border border-slate-300 text-left">#</th>
              <th className="py-4 px-4 border border-slate-300 text-left">
                Submitted On
              </th>
              <th className="py-4 px-4 border border-slate-300 text-left">
                Form Respondent
              </th>
              <th className="py-4 px-4 border border-slate-300 text-left">
                Points
              </th>
              <th className="py-4 px-4 border border-slate-300 text-left">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-4 text-center font-extrabold"
                >
                  Loading...
                </td>
              </tr>
            ) : data?.length ? (
              data?.map((response, index) => (
                <tr key={response._id}>
                  <td className="font-bold py-4 px-4 border border-slate-300 text-left">
                    {index + 1}
                  </td>
                  <td className="font-bold py-4 px-4 border border-slate-300 text-left">
                    {response?.createdAt &&
                      new Date(response?.createdAt).toLocaleString("en-IN", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "numeric",
                        hour12: true,
                      })}
                  </td>
                  <td className="font-bold py-4 px-4 border border-slate-300 text-left">
                    {response?.email}
                  </td>
                  <td className="font-bold py-4 px-4 border border-slate-300 text-left">
                    {response?.points}
                  </td>
                  <td className="font-bold py-4 px-4 border border-slate-300 text-left">
                    <Link to={`/forms/responses/${formId}/${response._id}`}>
                      <button className="px-2 py-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-white">
                        View
                      </button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-4 px-4 text-center font-extrabold"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap justify-between items-center">
        <div>
          {`Showing ${totalData === 0 ? 0 : 1 + (pageNo - 1) * pageSize} to ${
            totalData < pageSize ? totalData : pageNo * pageSize
          } of ${totalData}`}
        </div>

        <div className="flex">
          <button
            className="py-1 px-2 bg-neutral-900 hover:bg-neutral-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-s-md border-e border-solid border-neutral-400"
            onClick={() => setPageNo(pageNo - 1)}
            disabled={pageNo === 1}
          >
            Previous
          </button>
          {pageNo !== 1 && (
            <button
              className="py-1 px-2 bg-neutral-900 hover:bg-neutral-700 disabled:bg-neutral-700 text-white border-e border-solid border-neutral-400"
              onClick={() => setPageNo(pageNo - 1)}
            >
              {pageNo - 1}
            </button>
          )}
          <button
            title="current page"
            className="py-1 px-2 bg-neutral-900 text-white border-e border-solid border-neutral-400 cursor-none"
          >
            {pageNo}
          </button>
          {totalData > 1 && Math.ceil(totalData / pageSize) !== pageNo && (
            <button
              className="py-1 px-2 bg-neutral-900 hover:bg-neutral-700 disabled:bg-neutral-700 text-white border-e border-solid border-neutral-400"
              onClick={() => setPageNo(pageNo + 1)}
            >
              {pageNo + 1}
            </button>
          )}
          <button
            className="py-1 px-2 bg-neutral-900 hover:bg-neutral-700 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-e-md"
            onClick={() => setPageNo(pageNo + 1)}
            disabled={
              Number(totalData) < 1 ||
              Math.ceil(totalData / pageSize) === pageNo
            }
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
};

export default Responses;
