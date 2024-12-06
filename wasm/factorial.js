var Module = {
  onRuntimeInitialized: function() {
    console.log("WebAssembly module loaded");
    // Make factorial function globally available after module is initialized
    window.factorial = Module.cwrap('factorial', 'number', ['number']);
  }
};
