import type { Translations } from "../types";
import { common } from "./common";
import { teacher } from "./teacher";
import { billingShared } from "./billing";

export const ar: Translations = { ...common, teacher, billingShared };
