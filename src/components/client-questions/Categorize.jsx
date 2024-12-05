/* eslint-disable react/prop-types */
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Categorize = ({ index, data, answer, setAnswers }) => {
  const [options, setOptions] = useState([
    ...(data?.itemsWithBelongsTo?.map((opt) => opt.item) || []),
  ]);

  function setOption(result) {
    if (!result.destination) return;
    const category = result.destination.droppableId;
    const item = options?.find((_, i) => i === result?.source?.index);

    setAnswers((prev) => {
      let clone = [...prev];
      let oldAnswer = clone[index].answer;
      oldAnswer[category] = [...oldAnswer[category], item];
      clone[index].answer = oldAnswer;
      return clone;
    });

    setOptions((prev) => [...prev.filter((opt) => opt !== item)]);
  }

  return (
    <div>
      <div className="flex justify-between">
        <div className="font-semibold">Question {index + 1}</div>
        <div className="font-medium">Categorize</div>
        <div className="font-medium">Points: {data?.points}</div>
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

      <DragDropContext onDragEnd={setOption}>
        <Droppable droppableId={`categoryDrop${1}`} direction="horizontal">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <div className="mt-4 flex flex-wrap gap-1 justify-center">
                {options.map((option, index) => (
                  <Draggable
                    key={index}
                    index={index}
                    draggableId={`draggable-${index}`}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <div className="bg-neutral-400 text-white px-4 py-2 rounded-md">
                          {option}
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            </div>
          )}
        </Droppable>

        <div className="flex flex-wrap items-stretch gap-3 justify-center mt-4">
          {data?.categories?.map((category, i) => (
            <div
              key={i}
              className="text-center bg-neutral-200 w-36 min-h-[100px] rounded"
            >
              <span className="font-bold text-lg">{category}</span>
              <Droppable droppableId={category} direction="vertical">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {answer?.answer[category]?.map((item, itemIdx) => (
                      <div key={itemIdx}>
                        <div className="bg-neutral-400 text-white px-4 py-2 rounded-md inline-block mx-auto mb-1">
                          {item}
                        </div>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Categorize;
