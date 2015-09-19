var storage = require('dot-file-config')('.badtaste-npm', {
  cloudSync: false
});

storage.data.groups = storage.data.groups || [];

export default storage;
