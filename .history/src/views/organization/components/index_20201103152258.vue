<template>
  <div class="block">
    <div id="placeholder" class="nav"></div>
  </div>
</template>
<script type="text/javascript" src="http://localhost:8009/web-apps/apps/api/documents/api.js"></script>
<script>
  new DocsAPI.DocEditor("placeholder", {
       "document": {
          "fileType": "docx",
          "key": "12NAFE",
          "title": "test6.docx",
          "url": "http://blog.jiangliuhong.top/blogimg/other/test.docx"
      },
      "documentType": "text",
      "width": "1600px",
            "height": "900px",
            "editorConfig": {
                "callbackUrl": "https://example.com/url-to-callback.ashx"
            },
            "permissions": {
            "comment": true,
            "download": true,
            "edit": true,
            "fillForms": true,
            "print": true,
            "review": true
        }
})
</script>
