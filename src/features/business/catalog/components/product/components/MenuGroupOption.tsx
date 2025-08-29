"use client";
import { useState } from "react";
import { IOption } from "../../../types/catlog";
import OptionCard from "./views/OptionCard";
import EditMenuGroupOption from "./edits/EditMenuGroupOption";

interface MenuGroupOptionProps {
  option: IOption;
  currencyMask?: string;
  onUpdate: (data: { option: Partial<IOption> }) => void;
  onDelete?: (optionId: string) => void;
}

export default function MenuGroupOption({
  option,
  currencyMask = "$",
  onUpdate,
  onDelete,
}: MenuGroupOptionProps) {
  const [editing, setEditing] = useState(false);

  const onCancel = () => {
    setEditing(false);
  };

  return (
    <li className="rounded-xl mb-4 bg-gray-50 shadow-sm p-2">
      {editing ? (
        <EditMenuGroupOption
          onUpdate={onUpdate}
          option={option}
          currencyMask="$"
          onDelete={onDelete}
          onCancel={onCancel}
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
