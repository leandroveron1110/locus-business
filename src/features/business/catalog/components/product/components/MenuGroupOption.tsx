"use client";
import { useState } from "react";
import { IOption } from "../../../types/catlog";
import OptionCard from "./views/OptionCard";
import EditMenuGroupOption from "./edits/EditMenuGroupOption";

interface MenuGroupOptionProps {
  option: IOption;
  currencyMask?: string;
  onUpdate: (data: Partial<IOption>) => void; // <- más directo
  onDelete?: (optionId: string) => void;
}

export default function MenuGroupOption({
  option,
  currencyMask = "$",
  onUpdate,
  onDelete,
}: MenuGroupOptionProps) {
  const [editing, setEditing] = useState(false);

  const handleCancel = () => setEditing(false);

  return (
    <li className="rounded-xl mb-4 bg-gray-50 shadow-sm p-2">
      {editing ? (
        <EditMenuGroupOption
          option={option}
          onUpdate={({option}) => onUpdate(option)} // ya recibís Partial<IOption>
          onDelete={onDelete}
          onCancel={handleCancel}
          currencyMask={currencyMask}
        />
      ) : (
        <div className="cursor-pointer" onClick={() => setEditing(true)}>
          <OptionCard
            currencyMask={currencyMask}
            option={{
              name: option.name,
              hasStock: option.hasStock,
              maxQuantity: option.maxQuantity || 1,
              priceFinal: option.priceFinal,
            }}
          />
        </div>
      )}
    </li>
  );
}
