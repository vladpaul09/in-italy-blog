import { FC } from "react";
import { useInput, useResourceContext, useTranslate } from "react-admin";
import Box from "@mui/material/Box";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  AutoImage,
  Autoformat,
  Bold,
  Italic,
  Underline,
  BlockQuote,
  CloudServices,
  Essentials,
  Heading,
  Image,
  ImageCaption,
  ImageResize,
  ImageStyle,
  ImageToolbar,
  ImageUpload,
  PictureEditing,
  Indent,
  IndentBlock,
  Link,
  List,
  MediaEmbed,
  Mention,
  Paragraph,
  PasteFromOffice,
  Table,
  TableColumnResize,
  TableToolbar,
  TextTransformation,
  Fullscreen,
  Font,
  // SimpleUploadAdapter,
} from "ckeditor5";

// @ts-ignore
import CKEditorCustomUploadAdapter from "../../utils/CKEditorCustomUploadAdapter";

interface Props {
  source: string;
  label?: string;
}

const CKEditorInput: FC<Props> = ({ label, source }) => {
  const {
    id,
    field: { onChange, value },
    fieldState: { error },
  } = useInput({ source: source });
  const resource = useResourceContext();
  const translate = useTranslate();

  return (
    <Box component="div" sx={{ m: 0, p: 0 }}>
      <label htmlFor={id}>{label ? label : translate(`resources.${resource}.fields.${source}`)}</label>
      <CKEditor
        id={id}
        editor={ClassicEditor}
        config={{
          licenseKey: "GPL",
          plugins: [
            Autoformat,
            AutoImage,
            BlockQuote,
            Bold,
            CloudServices,
            Essentials,
            Heading,
            Font,
            Image,
            ImageCaption,
            ImageResize,
            ImageStyle,
            ImageToolbar,
            ImageUpload,
            // Base64UploadAdapter,
            CKEditorCustomUploadAdapter,
            Indent,
            IndentBlock,
            Italic,
            Link,
            List,
            MediaEmbed,
            Mention,
            Paragraph,
            PasteFromOffice,
            PictureEditing,
            Table,
            TableColumnResize,
            TableToolbar,
            TextTransformation,
            Underline,
            Fullscreen,
          ],
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "heading",
              "|",
              "fontSize",
              "fontFamily",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "bold",
              "italic",
              "underline",
              "|",
              "link",
              "uploadImage",
              "insertTable",
              "blockQuote",
              "mediaEmbed",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "outdent",
              "indent",
              "fullscreen",
            ],
            shouldNotGroupWhenFull: true,
          },
          heading: {
            options: [
              {
                model: "paragraph",
                title: "Paragraph",
                class: "ck-heading_paragraph",
              },
              {
                model: "heading1",
                view: "h1",
                title: "Heading 1",
                class: "ck-heading_heading1",
              },
              {
                model: "heading2",
                view: "h2",
                title: "Heading 2",
                class: "ck-heading_heading2",
              },
              {
                model: "heading3",
                view: "h3",
                title: "Heading 3",
                class: "ck-heading_heading3",
              },
              {
                model: "heading4",
                view: "h4",
                title: "Heading 4",
                class: "ck-heading_heading4",
              },
            ],
          },
          image: {
            resizeOptions: [
              {
                name: "resizeImage:original",
                label: "Default image width",
                value: null,
              },
              {
                name: "resizeImage:50",
                label: "50% page width",
                value: "50",
              },
              {
                name: "resizeImage:75",
                label: "75% page width",
                value: "75",
              },
            ],
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:wrapText",
              "imageStyle:breakText",
              "|",
              "resizeImage",
            ],
          },
          link: {
            addTargetToExternalLinks: true,
            defaultProtocol: "https://",
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        }}
        data={value}
        onChange={(_event, editor) => {
          onChange(editor.getData());
        }}
      />

      {error && <span style={{ color: "red" }}>{error.message}</span>}
    </Box>
  );
};

export default CKEditorInput;
