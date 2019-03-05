(function (a) {
  function k(b, a) {
    return fetch(b).then(function (b) {
      console.log("Pos 1");
      if (200 !== b.status) throw Error("Response failed with code " + b.status);
      console.log("Pos 2");
      console.log(b);
      console.log("Pos 2a");
      var d = !1,
        c = new ReadableStream({
          start: function (c) {
            function r() {
              if (!d) return console.log("Pos 4"), g.read().then(function (b) {
                d = b.done;
                b = b.value;
                d ? (console.log("Done"), (b = a.End()) ? c.enqueue(b) : c.close()) : (b = a.GetNextChunk(b), console.log("Enqueue"), b && c.enqueue(b))
              }).then(r)
            }
            console.log("Pos 3");
            var B = b.body;
            console.log("Pos 3z" + B);
            var g = B.getReader();
            r()
          }
        });
      console.log("Pos 2b");
      return new Response(c, {
        headers: {
          "content-type": "application/wasm"
        }
      })
    })
  }
  var h = function (b) {
      if ("string" === typeof b) {
        for (var a = new Uint8Array(b.length), e = b.length, d = 0; d < e; d++) a[d] = b.charCodeAt(d);
        return a
      }
      return b
    },
    d = function (b) {
      if ("string" !== typeof b) {
        for (var a = "", e = 0, d = b.length, c; e < d;) c = b.subarray(e, e + 1024), e += 1024, a += String.fromCharCode.apply(null, c);
        return a
      }
      return b
    },
    c = !1,
    l = function (b, v) {
      c || (importScripts(a.basePath +
        "external/decode.min.js"), c = !0);
      var e = self.BrotliDecode(h(b));
      return v ? e : d(e)
    },
    f = function () {
      this.remainingDataArrays = []
    };
  f.prototype = {
    processRaw: function (b) {
      return b
    },
    processBrotli: function (b) {
      this.remainingDataArrays.push(b);
      return null
    },
    GetNextChunk: function (b) {
      this.decodeFunction || (this.decodeFunction = 0 === b[0] && 97 === b[1] && 115 === b[2] && 109 === b[3] ? this.processRaw : this.processBrotli);
      return this.decodeFunction(b)
    },
    End: function () {
      if (this.remainingDataArrays.length) {
        for (var b = this.arrays, a = 0, e = 0; e < b.length; ++e) a +=
          b[e].length;
        for (var a = new Uint8Array(a), d = 0, e = 0; e < b.length; ++e) {
          var c = b[e];
          a.set(c, d);
          d += c.length
        }
        return l(a, !0)
      }
      return null
    }
  };
  var n = !1,
    m = function (b, c) {
      n || (importScripts(a.basePath + "external/rawinflate.js", a.basePath + "external/pako_inflate.min.js"), n = !0);
      var e = 10;
      if ("string" === typeof b) {
        if (b.charCodeAt(3) & 8) {
          for (; 0 !== b.charCodeAt(e); ++e);
          ++e
        }
      } else if (b[3] & 8) {
        for (; 0 !== b[e]; ++e);
        ++e
      }
      if (c) return b = h(b), b = b.subarray(e, b.length - 8), a.pako.inflate(b, {
        windowBits: -15
      });
      b = d(b);
      b = b.substring(e, b.length - 8);
      return a.RawDeflate.inflate(b)
    },
    q = function (b, a) {
      return a ? b : d(b)
    },
    g = function (b) {
      var a = !b.shouldOutputArray,
        e = new XMLHttpRequest;
      e.open("GET", b.url, b.isAsync);
      var c = a && e.overrideMimeType;
      e.responseType = c ? "text" : "arraybuffer";
      c && e.overrideMimeType("text/plain; charset=x-user-defined");
      e.send();
      var g = function () {
          Date.now();
          var r;
          r = c ? e.responseText : new Uint8Array(e.response);
          r.length < b.compressedMaximum ? (r = b.decompressFunction(r, b.shouldOutputArray), console.warn("Your server has not been configured to serve .gz and .br files with the expected Content-Encoding. See http://www.pdftron.com/kb_content_encoding for instructions on how to resolve this.")) :
            a && (r = d(r));
          return r
        },
        f;
      if (b.isAsync) f = new Promise(function (r, a) {
        e.onload = function () {
          200 === this.status ? r(g()) : a("Download Failed " + b.url)
        };
        e.onerror = function () {
          a("Network error occurred " + b.url)
        }
      });
      else {
        if (200 === e.status) return g();
        throw Error("Failed to load " + b.url);
      }
      return f
    },
    z = function (b) {
      var a = b.lastIndexOf("/"); - 1 === a && (a = 0);
      var e = b.slice(a).replace(".", ".br.");
      return b.slice(0, a) + e
    },
    p = function (b, a) {
      var e = b.lastIndexOf("/"); - 1 === e && (e = 0);
      var c = b.slice(e).replace(".", ".gz.");
      a.url = b.slice(0,
        e) + c;
      a.decompressFunction = m;
      return g(a)
    },
    t = function (b, a) {
      a.url = z(b);
      a.decompressFunction = l;
      return g(a)
    },
    u = function (b, a) {
      a.url = b;
      a.decompressFunction = q;
      return g(a)
    },
    x = function (b, a, e, c) {
      return b["catch"](function (b) {
        console.warn(b);
        return c(a, e)
      })
    },
    y = function (b, a, c) {
      var d;
      if (c.isAsync) {
        var g = a[0](b, c);
        for (d = 1; d < a.length; ++d) g = x(g, b, c, a[d]);
        return g
      }
      for (d = 0; d < a.length; ++d) try {
        return a[d](b, c)
      } catch (f) {
        console.warn(f.message)
      }
      throw Error("");
    };
  a.getBrotliUrl = z;
  a.loadURLWithBrotliPriority = function (b, a,
    c, d) {
    var g = {};
    g.compressedMaximum = a;
    g.isAsync = c;
    g.shouldOutputArray = d;
    return y(b, [t, p, u], g)
  };
  a.loadURLWithGzipPriority = function (b, a, c, d) {
    var g = {};
    g.compressedMaximum = a;
    g.isAsync = c;
    g.shouldOutputArray = d;
    return y(b, [p, t, u], g)
  };
  a.loadWasmBrotliStream = function (a) {
    return k(a, new f)
  }
})("undefined" === typeof window ? this : window);
(function (a) {
  var k = a._trnDebugMode || a._trnLogMode,
    h = a._logFiltersEnabled ? a._logFiltersEnabled : {};
  a.utils = a.utils ? a.utils : {};
  a.utils.warn = function (a, c) {
    c || (c = a, a = "default");
    k && h[a] && console.warn(a + ": " + c)
  };
  a.utils.log = function (a, c) {
    c || (c = a, a = "default");
    k && h[a] && console.log(a + ": " + c)
  };
  a.utils.error = function (a) {
    k && console.error(a);
    throw Error(a);
  };
  a.info = function (a, c) {};
  a.warn = function (d, c) {
    a.utils.warn(d, c)
  };
  a.error = function (d) {
    a.utils.error(d)
  }
})("undefined" === typeof window ? this : window);
(function (a) {
  function k(a) {
    return new Promise(function (c, h) {
      var f = indexedDB.open("wasm-cache", a);
      f.onerror = h.bind(null, "Error opening wasm cache database");
      f.onsuccess = function () {
        c(f.result)
      };
      f.onupgradeneeded = function (a) {
        var c = f.result;
        c.objectStoreNames.contains("wasm-cache") && (console.log("Clearing out version " + a.oldVersion + " wasm cache"), c.deleteObjectStore("wasm-cache"));
        console.log("Creating version " + a.newVersion + " wasm cache");
        c.createObjectStore("wasm-cache")
      }
    })
  }

  function h(a, c) {
    return new Promise(function (h,
      f) {
      var k = a.transaction(["wasm-cache"]).objectStore("wasm-cache").get(c);
      k.onsuccess = function (a) {
        k.result ? h(k.result) : f("Module " + c + " was not found in wasm cache")
      };
      k.onerror = f.bind(null, "Error getting wasm module " + c)
    })
  }
  a.isWasmCached = function (a, c) {
    return k(a).then(function (a) {
      return h(a, c).then(function () {
        return !0
      })
    })["catch"](function () {
      return !1
    })
  };
  a.instantiateCachedURL = function (d, c, l, f) {
    function n(a, d) {
      var f = a.transaction(["wasm-cache"], "readwrite").objectStore("wasm-cache").put(d, c);
      f.onerror =
        function (a) {
          console.log("Failed to store in wasm cache: " + a)
        };
      f.onsuccess = function (a) {
        console.log("Successfully stored " + c + " in wasm cache")
      }
    }

    function m(g) {
      q = q || Date.now();
      return g ? WebAssembly.instantiateStreaming(fetch(a.getBrotliUrl(c)), l)["catch"](function (a) {
        return m(!1)
      }) : a.loadURLWithBrotliPriority(c, f, !0, !0).then(function (a) {
        Date.now();
        return WebAssembly.instantiate(a, l)
      })
    }
    var q;
    return k(d).then(function (a) {
      return h(a, c).then(function (a) {
        return WebAssembly.instantiate(a, l)
      }, function (c) {
        return m(!!WebAssembly.instantiateStreaming).then(function (c) {
          try {
            n(a,
              c.module)
          } catch (d) {}
          return c.instance
        })
      })
    }, function (a) {
      console.log(a);
      return m().then(function (a) {
        return a.instance
      })
    })
  }
})(this);
(function (a) {
  a.Uint8ClampedArray || (a.Uint8ClampedArray = a.Uint8Array);
  var k = !(!self.WebAssembly || !self.WebAssembly.validate),
    h = /^((?!chrome|android).)*safari/i.test(a.navigator.userAgent),
    d = /Mac OS X 10_13_6.*\(KHTML, like Gecko\)$/.test(a.navigator.userAgent),
    c = -1 < a.navigator.userAgent.indexOf("Edge/16"),
    l = function (a) {
      var c = this;
      this.promise = a.then(function (a) {
        c.response = a;
        c.status = 200
      })
    };
  l.prototype = {
    addEventListener: function (a, c) {
      this.promise.then(c)
    }
  };
  a.loadCompiledBackend = function (f, n, m) {
    if (!k ||
      m || c || h || d) {
      m = loadURLWithGzipPriority((Module.asmjsPrefix ? Module.asmjsPrefix : "") + f + ".js.mem", n[".js.mem"], !1);
      var q = loadURLWithGzipPriority((Module.memoryInitializerPrefixURL ? Module.memoryInitializerPrefixURL : "") + f + ".mem", n[".mem"], !0, !0);
      Module.memoryInitializerRequest = new l(q)
    } else Module.instantiateWasm = function (c, d) {
      return self.instantiateCachedURL(a.getWasmVersion(f), f + "Wasm.wasm", c, n["Wasm.wasm"]).then(function (a) {
        d(a)
      })
    }, m = loadURLWithBrotliPriority(f + "Wasm.js.mem", n["Wasm.js.mem"], !1, !1);
    eval.call(self,
      m)
  }
})("undefined" === typeof window ? this : window);
(function (a) {
  function k() {
    for (var a = 0; a < w.length; a++) w[a][0](w[a][1]);
    w = [];
    A = !1
  }

  function h(a, b) {
    w.push([a, b]);
    A || (A = !0, C(k, 0))
  }

  function d(a, b) {
    function c(a) {
      f(b, a)
    }

    function d(a) {
      m(b, a)
    }
    try {
      a(c, d)
    } catch (e) {
      d(e)
    }
  }

  function c(a) {
    var c = a.owner,
      d = c.state_,
      c = c.data_,
      e = a[d];
    a = a.then;
    if ("function" === typeof e) {
      d = b;
      try {
        c = e(c)
      } catch (g) {
        m(a, g)
      }
    }
    l(a, c) || (d === b && f(a, c), d === v && m(a, c))
  }

  function l(a, b) {
    var c;
    try {
      if (a === b) throw new TypeError("A promises callback cannot return that same promise.");
      if (b && ("function" ===
          typeof b || "object" === typeof b)) {
        var d = b.then;
        if ("function" === typeof d) return d.call(b, function (d) {
          c || (c = !0, b !== d ? f(a, d) : n(a, d))
        }, function (b) {
          c || (c = !0, m(a, b))
        }), !0
      }
    } catch (e) {
      return c || m(a, e), !0
    }
    return !1
  }

  function f(a, b) {
    a !== b && l(a, b) || n(a, b)
  }

  function n(a, b) {
    a.state_ === x && (a.state_ = y, a.data_ = b, h(g, a))
  }

  function m(a, b) {
    a.state_ === x && (a.state_ = y, a.data_ = b, h(z, a))
  }

  function q(a) {
    var b = a.then_;
    a.then_ = void 0;
    for (a = 0; a < b.length; a++) c(b[a])
  }

  function g(a) {
    a.state_ = b;
    q(a)
  }

  function z(a) {
    a.state_ = v;
    q(a)
  }

  function p(a) {
    if ("function" !==
      typeof a) throw new TypeError("Promise constructor takes a function argument");
    if (!1 === this instanceof p) throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
    this.then_ = [];
    d(a, this)
  }
  a.createPromiseCapability = function () {
    var a = {},
      b = new p(function (b, c) {
        a.resolve = b;
        a.reject = c
      });
    a.promise = b;
    return a
  };
  var t = a.Promise,
    u = t && "resolve" in t && "reject" in t && "all" in t && "race" in t && function () {
      var a;
      new t(function (b) {
        a = b
      });
      return "function" ===
        typeof a
    }();
  "undefined" !== typeof exports && exports ? (exports.Promise = u ? t : p, exports.Polyfill = p) : "function" == typeof define && define.amd ? define(function () {
    return u ? t : p
  }) : u || (a.Promise = p);
  var x = "pending",
    y = "sealed",
    b = "fulfilled",
    v = "rejected",
    e = function () {},
    C = "undefined" !== typeof setImmediate ? setImmediate : setTimeout,
    w = [],
    A;
  p.prototype = {
    constructor: p,
    state_: x,
    then_: null,
    data_: void 0,
    then: function (a, d) {
      var g = {
        owner: this,
        then: new this.constructor(e),
        fulfilled: a,
        rejected: d
      };
      this.state_ === b || this.state_ === v ? h(c,
        g) : this.then_.push(g);
      return g.then
    },
    "catch": function (a) {
      return this.then(null, a)
    }
  };
  p.all = function (a) {
    if ("[object Array]" !== Object.prototype.toString.call(a)) throw new TypeError("You must pass an array to Promise.all().");
    return new this(function (b, c) {
      function d(a) {
        g++;
        return function (c) {
          e[a] = c;
          --g || b(e)
        }
      }
      for (var e = [], g = 0, f = 0, k; f < a.length; f++)(k = a[f]) && "function" === typeof k.then ? k.then(d(f), c) : e[f] = k;
      g || b(e)
    })
  };
  p.race = function (a) {
    if ("[object Array]" !== Object.prototype.toString.call(a)) throw new TypeError("You must pass an array to Promise.race().");
    return new this(function (b, c) {
      for (var d = 0, e; d < a.length; d++)(e = a[d]) && "function" === typeof e.then ? e.then(b, c) : b(e)
    })
  };
  p.resolve = function (a) {
    return a && "object" === typeof a && a.constructor === this ? a : new this(function (b) {
      b(a)
    })
  };
  p.reject = function (a) {
    return new this(function (b, c) {
      c(a)
    })
  }
})("undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : this);
(function (a) {
  ArrayBuffer.prototype.slice || (ArrayBuffer.prototype.slice = function (a, h) {
    void 0 === a && (a = 0);
    void 0 === h && (h = this.byteLength);
    a = Math.floor(a);
    h = Math.floor(h);
    0 > a && (a += this.byteLength);
    0 > h && (h += this.byteLength);
    a = Math.min(Math.max(0, a), this.byteLength);
    h = Math.min(Math.max(0, h), this.byteLength);
    if (0 >= h - a) return new ArrayBuffer(0);
    var d = new ArrayBuffer(h - a),
      c = new Uint8Array(d),
      l = new Uint8Array(this, a, h - a);
    c.set(l);
    return d
  })
})(this);
var tikTokStart = null;
(function (a) {
  function k(a) {
    a = d(a);
    f(a.msg)
  }

  function h() {
    q = function () {}
  }

  function d(a) {
    var c = [];
    return {
      resource_array: c,
      msg: JSON.stringify(a.data, function (a, d) {
        if ("object" === typeof d) {
          var g = null;
          d instanceof Uint8Array ? g = d : d instanceof ArrayBuffer && (g = new Uint8Array(d));
          if (g) {
            var f = n(g.length),
              h = m(f);
            h && (new Uint8Array(Module.HEAPU8.buffer, h, g.length)).set(g);
            c.push(f);
            return {
              __trn_res_id: f
            }
          }
        }
        return d
      })
    }
  }
  a.basePath = "../";
  var c = a.officeWorkerPath || "";
  a.workerBasePath && (a.basePath = a.workerBasePath);
  importScripts(a.basePath +
    "external/Promise.js");
  var l = [];
  onmessage = function (a) {
    l || (l = []);
    l.push(a)
  };
  a.ContinueFunc = function (a) {
    q("ContinueFunc called");
    setTimeout(function () {
      onmessage({
        data: {
          action: "continue"
        }
      })
    }, a)
  };
  a.Module = {
    onRuntimeInitialized: function () {
      console.log("on ready");
      q || h();
      var c = Date.now() - tikTokStart;
      a.utils.log("load", "time duration from start to ready: " + JSON.stringify(c));
      f = Module.cwrap("TRN_OnMessage", null, ["string"]);
      n = Module.cwrap("TRN_CreateBufferResource", "number", ["number"]);
      m = Module.cwrap("TRN_GetResourcePointer",
        "number", ["number"]);
      q("OnReady called");
      onmessage = k;
      Module._TRN_InitWorker();
      for (c = 0; c < l.length; ++c) onmessage(l[c]);
      l = null
    },
    fetchSelf: function () {
      tikTokStart = Date.now();
      a.loadCompiledBackend(c + "WebOfficeWorker", {
        "Wasm.wasm": 5E6,
        "Wasm.js.mem": 1E5,
        ".js.mem": 5E6,
        ".mem": 3E6
      }, !0);
      console.log("end of fetch self")
    },
    noExitRuntime: !0
  };
  var f, n, m, q;
  a.Module.fetchSelf()
})("undefined" === typeof window ? this : window);
