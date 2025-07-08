import React from "react";

export default function Footer() {
  return (
    <>
      <footer className="relative bg-slate-900 dark:bg-slate-800">
        <div className="py-[30px] px-0 border-t border-gray-800 dark:border-gray-700">
          <div className="container text-center">
            <div className="grid md:grid-cols-2 items-center gap-6">
              <div className="md:text-start text-center">
                <p className="mb-0 text-gray-300">
                  ©{" "}
                  <script
                    type="text/javascript"
                    id="www-widgetapi-script"
                    src="https://www.youtube.com/s/player/d87d581f/www-widgetapi.vflset/www-widgetapi.js"
                  ></script>
                  <script
                    id="iframe_api"
                    src="https://www.youtube.com/iframe_api"
                  ></script>
                  {new Date().getFullYear()} My Website
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
