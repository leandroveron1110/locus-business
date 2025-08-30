"use client";
import { IOptionGroup } from "../../../types/catlog";
import ViewMenuGroup from "./views/ViewMenuGroup";

interface MenuGroupProps {
  group: IOptionGroup;
  currencyMask?: string;
  onUpdate: (data: { group: Partial<IOptionGroup> }) => void;
  onDeleteGroup: (groupId: string, optionsId: string[]) => void;
}

export default function MenuGroup({
  group,
  currencyMask = "$",
  onUpdate,
  onDeleteGroup,
}: MenuGroupProps) {
  return (
    <ViewMenuGroup
      group={group}
      currencyMask={currencyMask}
      onUpdate={onUpdate}
      onDeleteGroup={onDeleteGroup}
    />
  );
}
