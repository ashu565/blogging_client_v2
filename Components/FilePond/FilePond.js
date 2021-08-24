import { useEffect, useState } from "react";
// Import React FilePond
import { FilePond, File, registerPlugin } from "react-filepond";
import { useRouter } from "next/router";
// Import FilePond styles
import "filepond/dist/filepond.min.css";
// Our app
export default function App({ HandleUpload }) {
  const [files, setFiles] = useState([]);
  const [render, setRender] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setRender(true);
  }, []);
  return (
    <div className="App">
      <FilePond
        files={files}
        onupdatefiles={setFiles}
        allowMultiple={false}
        maxFiles={1}
        server={{
          // url: "http://127.0.0.1:3000/api/v1/auth/updateProfilePhoto",
          url: "https://blogger414.herokuapp.com/api/v1/auth/updateProfilePhoto",
          process: {
            headers: {
              authorization: render ? localStorage.getItem("token") : null, // localStorage is only available in client side if not done like this it will lead to the error
            },
            onload: (res) => {
              if (render) {
                HandleUpload("success");
              }
            },
            onerror: (err) => {
              if (render) {
                HandleUpload("error");
              }
            },
          },
        }}
        name="image"
        labelIdle='Drag & Drop or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
}
