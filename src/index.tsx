import React from "react";
import { createRoot } from "react-dom/client";
import ColumnsI18next from "pages/ColumnsI18next";
//theme
import "primereact/resources/themes/md-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
import "./normalize.scss";

const domNode = document.getElementById("root");
const root = createRoot(domNode);
root.render(<ColumnsI18next />);
