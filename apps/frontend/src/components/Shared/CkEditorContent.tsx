import { FC } from "react";
import cn from "@/utils/cn.utils";

const CkEditorContent: FC<{ content: string }> = ({ content }) => (
  <>
    <style dangerouslySetInnerHTML={{
      __html: `
        .ck-content h1 {
          font-size: 2em !important;
          font-weight: bold !important;
          margin: 0.67em 0 !important;
          line-height: 1.2 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content h2 {
          font-size: 1.5em !important;
          font-weight: bold !important;
          margin: 0.75em 0 !important;
          line-height: 1.3 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content h3 {
          font-size: 1.17em !important;
          font-weight: bold !important;
          margin: 0.83em 0 !important;
          line-height: 1.4 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content h4 {
          font-size: 1em !important;
          font-weight: bold !important;
          margin: 1.12em 0 !important;
          line-height: 1.4 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content h5 {
          font-size: 0.83em !important;
          font-weight: bold !important;
          margin: 1.5em 0 !important;
          line-height: 1.4 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content h6 {
          font-size: 0.67em !important;
          font-weight: bold !important;
          margin: 1.67em 0 !important;
          line-height: 1.4 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content p {
          font-size: 1em !important;
          font-weight: normal !important;
          margin: 1em 0 !important;
          line-height: 1.5 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content ul {
          display: block !important;
          list-style-type: disc !important;
          margin: 1em 0 !important;
          padding-left: 40px !important;
          line-height: 1.5 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content ol {
          display: block !important;
          list-style-type: decimal !important;
          margin: 1em 0 !important;
          padding-left: 40px !important;
          line-height: 1.5 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
        .ck-content li {
          display: list-item !important;
          font-size: 1em !important;
          font-weight: normal !important;
          margin: 0.5em 0 !important;
          line-height: 1.5 !important;
          letter-spacing: normal !important;
          font-family: inherit !important;
        }
      `
    }} />
    <div className={cn("ck-content", "overflow-hidden", "m-0", "p-0")} dangerouslySetInnerHTML={{ __html: content }} />
  </>
);

export default CkEditorContent;
