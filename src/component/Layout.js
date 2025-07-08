// components/Layout.js
import React from "react";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  );
}
