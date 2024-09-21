import {createRoot} from "react-dom/client";
import {RouterProvider} from "react-router-dom";
import "./index.css";
import {router} from "@/router.tsx";
import {postEvent} from "@telegram-apps/sdk";

if (window?.Telegram) {
  postEvent("web_app_expand");
}

createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);

//viewport fix
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => {
    document.body.style.height = window?.visualViewport?.height + "px";
  });
}

// This will ensure user never overscroll the page
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) window.scrollTo(0, 0);
});
