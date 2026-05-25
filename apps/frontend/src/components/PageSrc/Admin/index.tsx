"use client";

import dynamic from "next/dynamic";

import "ckeditor5/ckeditor5.css";
import "./custom-ckeditor.css";

const AdminApp = dynamic(() => import("./App"), {
  ssr: false, // Required to avoid react-router related errors
});

export default AdminApp;
