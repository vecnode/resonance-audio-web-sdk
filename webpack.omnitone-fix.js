/**
 * Webpack plugin to fix Omnitone module export.
 * module.exports = Omnitone; to the bundled module.
 * Compatible with webpack 3.
 */

function OmnitoneExportPlugin() {}

OmnitoneExportPlugin.prototype.apply = function(compiler) {
  compiler.plugin('emit', (compilation, callback) => {
    // Run after all processing is complete
    Object.keys(compilation.assets).forEach((filename) => {
      if (filename.endsWith('.js')) {
        let source = compilation.assets[filename].source();
        
        // Find the Omnitone IIFE module and add module.exports
        // For regular builds: look for "return Omnitone;\n\n}());\n\n\n/***/ }),"
        // For minified builds: look for module containing createFOARenderer/createHOARenderer
        // that ends before the version module
        
        let modified = false;
        
        if (filename.includes('.min.')) {
          // Minified build: find module that contains createFOARenderer and createHOARenderer
          // This should be the Omnitone module (module 13)
          const createFOAIndex = source.indexOf('createFOARenderer');
          const createHOAIndex = source.indexOf('createHOARenderer');
          
          if (createFOAIndex !== -1 && createHOAIndex !== -1) {
            // Find the module that contains these methods
            // Look backwards to find module start, forwards to find module end
            const moduleStart = source.lastIndexOf('/***/ }),', createFOAIndex);
            const moduleEnd = source.indexOf('/***/ }),', createHOAIndex + 50);
            
            if (moduleStart !== -1 && moduleEnd !== -1) {
              const moduleContent = source.substring(moduleStart, moduleEnd);
              
              // Check if this module already exports
              if (!moduleContent.match(/module\.exports\s*[=:]/)) {
                // Find where the IIFE ends (look for }()); pattern)
                const iifeEnd = moduleContent.lastIndexOf('}());');
                if (iifeEnd !== -1) {
                  const insertIndex = moduleStart + iifeEnd + '}());'.length;
                  source = source.substring(0, insertIndex) + 'module.exports=A;' + source.substring(insertIndex);
                  modified = true;
                }
              }
            }
          }
        } else {
          // Regular build: use the known pattern
          const searchString = 'return Omnitone;\n\n}());\n\n\n/***/ }),';
          const searchIndex = source.indexOf(searchString);
          
          if (searchIndex !== -1) {
            const beforeMatch = source.substring(0, searchIndex);
            const moduleStart = beforeMatch.lastIndexOf('/***/ }),');
            const moduleEnd = searchIndex + searchString.length;
            const moduleContent = source.substring(moduleStart, moduleEnd);
            
            if (!moduleContent.includes('module.exports = Omnitone')) {
              const insertIndex = searchIndex + 'return Omnitone;\n\n}());\n\n\n'.length;
              source = source.substring(0, insertIndex) + 
                       'module.exports = Omnitone;\n\n' + 
                       source.substring(insertIndex);
              modified = true;
            }
          }
        }
        
        if (modified) {
          compilation.assets[filename] = {
            source: () => source,
            size: () => source.length
          };
        }
      }
    });
    callback();
  });
};

module.exports = OmnitoneExportPlugin;

