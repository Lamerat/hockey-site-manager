export const editorConfig = {
  toolbar: [
      { name: 'corrections', items: ['Undo', 'Redo'] },
      { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText'] },
      { name: 'basicStyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
      { name: 'colors', items: ['TextColor', 'BGColor']},
      { name: 'styles', items: ['Format'] },
      { name: 'paragraph', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'NumberedList', 'BulletedList'] },
      { name: 'tools', items: ['Link', 'Table', 'Image'] },
      { name: 'other', items: ['Maximize'] }
  ],
  removeButtons: 'Subscript,Superscript',
  
  plugins: [
      'basicstyles',
      'clipboard',
      'colorbutton',
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
      'resize',
      'autogrow',
      'table',
      'image',
  ],
}