document.addEventListener('DOMContentLoaded', function () {
  restore_options();
  document.getElementById('save').addEventListener('click', save_options);
  // document.getElementById('clear').addEventListener('click', clear_storage);
});

function save_options() {
  // Read settings from Options pop-up box:
  var walletPort = String(document.getElementById('monero-wallet-rpc-port').value);
  var remote = String(document.getElementById('options-remote').value);
  var saveAuth = false, username = '', password = '';
  if (document.getElementById('options-save-auth').checked) {
    var saveAuth = true;
    var remote = String(document.getElementById('options-remote').value);
    var username = String(document.getElementById('options-username').value);
    var password = String(document.getElementById('options-password').value);
  }
  // Save options in Chrome storage:
  if (Number(walletPort) >= 1 && Number(walletPort) <= 65535) {
    chrome.storage.sync.set({
      remote: remote,
      walletPort: walletPort,
      saveAuth: saveAuth,
      username: username,
      password: password
    }, function() {
      var status = document.getElementById('status');
      updateWalletInfo(remote, walletPort, saveAuth, username, password);
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });
  } else {
    var status = document.getElementById('status');
    chrome.storage.sync.set({
      remote: remote,
      walletPort: '20202',
      saveAuth: saveAuth,
      username: username,
      password: password
    }, function() {
      var status = document.getElementById('status');
      updateWalletInfo(remote, walletPort, saveAuth, username, password);
      document.getElementById('monero-wallet-rpc-port').value = 20202;
      status.textContent = 'Options saved. Port invalid... set to 20202.';
      setTimeout(function() {
        status.textContent = '';
      }, 2000);
    });


    setTimeout(function() {
      status.textContent = '';
      save_options();
    }, 2000);
  }
}

function restore_options() {
  // Get saved options from Chrome storage:
  chrome.storage.sync.get({
    remote: '',
    walletPort: '',
    saveAuth: false,
    username: '',
    password: ''
  }, function(items) {
    document.getElementById('monero-wallet-rpc-port').value = items.walletPort;
    document.getElementById('options-save-auth').checked = items.saveAuth;
    document.getElementById('options-username').value = items.username;
    document.getElementById('options-password').value = items.password;
    document.getElementById('options-remote').value = items.remote;
  });
}

function clear_storage() {
  // Clear all saved options in Chrome storage:
  chrome.storage.sync.clear( function() {
    var status = document.getElementById('status')
    document.getElementById('monero-wallet-rpc-port').value = '';
    document.getElementById('options-save-auth').checked = false;
    status.textContent = 'Options cleared';
    setTimeout(function() {
      status.textContent = '';
    }, 2000);
  });
}

function updateWalletInfo(remote, port, saveAuth, username, password) {
  var request = {
    greeting: "Electronero electronero-wallet-rpc Update Wallet Info",
    remote: remote,
    newWalletPort: port,
    saveAuth: saveAuth,
    username: username,
    password: password
  };
  chrome.runtime.sendMessage(request, function (resp) {
    console.log(resp);
  });
};
