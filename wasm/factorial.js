var Module = {
  onRuntimeInitialized: function() {
    console.log("WebAssembly module loaded");
  }
};

var factorial = Module.cwrap('factorial', 'number', ['number']);
