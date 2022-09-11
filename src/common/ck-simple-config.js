export const editorConfig = {
  toolbar: [
      { name: 'corrections', items: ['Undo', 'Redo'] },
      { name: 'basicStyles', items: ['Bold', 'Italic', 'Underline'] },
      { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText'] },
      { name: 'tools', items: ['Link',] },
      
  ],

  removeButtons: 'Subscript,Superscript',
  resize_enabled: false,
  resize_maxHeight: 200,
  removePlugins: 'resize',
  enterMode: 2,
  plugins: [
      'basicstyles',
      'clipboard',
      'emoji',
      'enterkey',
      'entities',
      'floatingspace',
      'indentlist',
      'justify',
      'link',
      'list',
      'toolbar',
      'undo',
      'wysiwygarea',
      'maximize',
      'format',
      'table',
      'image',
  ],
}