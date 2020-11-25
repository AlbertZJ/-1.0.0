<template>
  <div class="block">
    <div id="placeholder" class="nav"></div>
  </div>
</template>
<script>
  new DocsAPI.DocEditor("placeholder", {
       "document": {
          "fileType": "docx",
          "key": "12NAFE",
          "title": "test6.docx",
          "url": "../../assets/images/shuguoyiyou.jpg"
      },
      "documentType": "text",
      "width": "1600px",
            "height": "900px",
            "editorConfig": {
                "callbackUrl": "../../assets/images"
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
