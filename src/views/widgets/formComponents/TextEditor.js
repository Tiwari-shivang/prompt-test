import React, { useEffect, useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const TextEditor = ({
    editorStates,
    editorStateChange,
  }) => {

  return (
        <div className='textEditor'>
            <Editor
              editorState={editorStates}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={editorStateChange}
            />
         </div>
  )
}

export default TextEditor
