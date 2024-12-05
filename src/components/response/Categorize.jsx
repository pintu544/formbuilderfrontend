/* eslint-disable react/prop-types */

const Categorize = ({ index, data, answer }) => {
  const answersArr = answer
    ? Object.values(answer).reduce((prev, curr) => [...prev, ...curr], [])
    : [];
  const options = data?.itemsWithBelongsTo
    ?.filter((item) => !answersArr.includes(item.item))
    ?.map((item) => item.item);

  return (
    <div>
      <div className="flex justify-between">
        <div className="font-semibold">Question {index + 1}</div>
        <div className="font-medium">Categorize</div>
        <div className="font-medium">
          Scored: {data?.scored}/{data?.points}
        </div>
      </div>

      {data?.imageUrl && (
        <div className="flex justify-center mt-3">
          <div className="w-[min(500px,100%)]">
            <img
              src={data?.imageUrl}
              className="w-full max-h-52 object-contain"
            />
          </div>
        </div>
      )}

      {data?.description && (
        <p className="text-center py-1">{data?.description}</p>
      )}

      <div>
        <div className="mt-4 flex flex-wrap gap-1 justify-center">
          {options.map((option, index) => (
            <div
              key={index}
              className="bg-neutral-400 text-white px-4 py-2 rounded-md"
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-3 justify-center mt-4">
        {data?.categories?.map((category, i) => (
          <div
            key={i}
            className="text-center bg-neutral-200 w-36 min-h-[100px] rounded"
          >
            <span className="font-bold text-lg">{category}</span>
            {answer[category]?.map((item, itemIdx) => (
              <div key={itemIdx}>
                <div className="bg-neutral-400 text-white px-4 py-2 rounded-md inline-block mx-auto mb-1">
                  {item}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorize;
