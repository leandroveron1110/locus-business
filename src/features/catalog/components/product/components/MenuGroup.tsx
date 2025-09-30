"use client";
import { IOptionGroup } from "../../../types/catlog";
import ViewMenuGroup from "./views/ViewMenuGroup";

interface MenuGroupProps {
  businessId: string;
  menuId: string;
  sectionId: string;
  groupId: string;
  productId: string;
  currencyMask?: string;
  onUpdate: (data: { group: Partial<IOptionGroup> }) => void;
  onDeleteGroup: (groupId: string, optionsId: string[]) => void;
}

export default function MenuGroup({
  businessId,
  groupId,
  menuId,
  productId,
  sectionId,
  currencyMask = "$",
  onUpdate,
  onDeleteGroup,
}: MenuGroupProps) {
  return (
    <ViewMenuGroup
      businessId={businessId}
      groupId={groupId}
      menuId={menuId}
      productId={productId}
      sectionId={sectionId}
      currencyMask={currencyMask}
      onUpdate={onUpdate}
      onDeleteGroup={onDeleteGroup}
    />
  );
}
