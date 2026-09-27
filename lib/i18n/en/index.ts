import type { Translations } from "../types";
import { common } from "./common";
import { teacher } from "./teacher";
import { school } from "./school";
import { billingShared } from "./billing";

export const en: Translations = { ...common, teacher, school, billingShared };
