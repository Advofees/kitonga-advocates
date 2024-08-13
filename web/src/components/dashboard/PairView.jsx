import {} from "react";
import { utilityFunctions } from "../../assets/functions";

export function PairView({ fields = [], className = "", obj = {} }) {
  return (
    <div className={`${className}`}>
      {fields.map((field, index) => (
        <div
          key={index}
          className={`flex ${
            field.dir === "h" ? "flex-row" : "flex-col"
          } gap-2 p-1`}
        >
          <span
            className={` break-all font-bold ${
              field.dir === "h" ? "w-[40%] text-end px-2" : "w-full px-4"
            } px-2`}
          >
            {utilityFunctions.snakeCaseToTitleCase(field.name || "")}
          </span>
          <span
            className={` break-all ${field.dir === "h" ? "w-[60%] px-2" : "w-full px-4"}`}
          >
            {obj[field.name]}
          </span>
        </div>
      ))}
    </div>
  );
}
