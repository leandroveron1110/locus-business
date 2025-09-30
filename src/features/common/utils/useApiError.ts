import { useEffect } from "react";
import { ApiError } from "@/types/api";import { useAlert } from "../ui/Alert/Alert";
import { getDisplayErrorMessage } from "@/lib/uiErrors";
;

export const useApiError = (isError: boolean, error: unknown) => {
  const { addAlert } = useAlert();

  useEffect(() => {
    if (isError && error) {
      addAlert({
        message: getDisplayErrorMessage(error as ApiError),
        type: "error",
      });
    }
  }, [isError, error, addAlert]);
};
