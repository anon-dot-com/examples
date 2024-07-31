install:
  yarn install

build: install
  yarn build

dev: build
  yarn dev

build-dir := `echo $(pwd)/tool/runtime-extension/build`
extensionId build="dev":
  #!/usr/bin/env python
  # god bless these people
  # https://stackoverflow.com/questions/26053434/how-is-the-chrome-extension-id-of-an-unpacked-extension-generated
  import hashlib

  m = hashlib.sha256()
  m.update(bytes('{{build-dir}}/chrome-mv3-{{build}}'.encode('utf-8')))
  extension_id = ''.join([chr(int(i, base=16) + ord('a')) for i in m.hexdigest()][:32])
  print(extension_id)