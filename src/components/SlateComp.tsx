import CryptoJS from 'crypto-js';
import { ClipboardEventHandler, useState } from 'react';
import { createEditor } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

const SlateComp = () => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const initialValue = [
    {
      type: 'paragraph',
      children: [
        {
          text: 'Paste here anything. I will check the clipboard for you!\n\n(It shows up to developer console tab!)',
        },
      ],
    },
  ];

  const paste: ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const { clipboardData } = e;

    // Print console about 'List of the type.'
    for (let i = 0; i < clipboardData.items.length; i++) {
      console.log(
        '%cType : ',
        'background:blue;color:white',
        clipboardData.items[i].type,
      );
      console.log(
        '%cContents : \n',
        'background:#3c3c3c;color:white',
        clipboardData.getData(clipboardData.items[i].type),
      );
    }

    const slateData = clipboardData.getData('application/x-slate-fragment'); // mime-type
    if (slateData) {
      const decodedData = decodeURIComponent(
        CryptoJS.enc.Base64.parse(slateData).toString(CryptoJS.enc.Utf8),
      );
      const parsedElements = JSON.parse(decodedData);
      console.log(
        'Encrypted DATA about application/x-slate-fragment\n\nData Parsed :',
        parsedElements,
      );
    }

    console.log('-----------------------------');
  };

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable onPaste={(e) => paste(e)} />
    </Slate>
  );
};

export default SlateComp;
