[![Continuous Integration](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Replace Conditional with Polymorphism

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
switch (bird.type) {
  case 'EuropeanSwallow':
    return 'average';
  case 'AfricanSwallow':
    return bird.numberOfCoconuts > 2 ? 'tired' : 'average';
  case 'NorwegianBlueParrot':
    return bird.voltage > 100 ? 'scorched' : 'beautiful';
  default:
    return 'unknown';
}
```

</td>

<td>

```javascript
class EuropeanSwallow {
  get plumage() {
    return 'average';
  }
}

class AfricanSwallow {
  get plumage() {
    return this.numberOfCoconuts > 2 ? 'tired' : 'average';
  }
}

class NorwegianBlueParrot {
  get plumage() {
    return this.voltage > 100 ? 'scorched' : 'beautiful';
  }
}
```

</td>
</tr>
</tbody>
</table>

Conditionals are a quick and easy way to derive behavior based on an object's peperties but, sometimes, this derivatives had to be done in several places, often highlighting that something is not quite right or, at least, could be done better. This refactoring helps in these cases.

## Working examples

The book brings us two examples: The "birds example" focuses on using polymorphism to create a general class hierarchy for `Bird`s, while the "rating example" highlights how to use polymorphism to isolate particular logic that goes slightly outside of the base implementation.

### Example #1: Generalization hierarchy

In this example, we have a couple of functions responsible for yielding different values depending on a given bird's type. These functions have the same `switch/case` structure and, as we can imagine, will suffer from several problems should new bird types be added. Our goal is to use polymorphism to move out of these switch statements.

```javascript
export function plumage(bird) {
  switch (bird.type) {
    case 'EuropeanSwallow':
      return 'average';
    case 'AfricanSwallow':
      return bird.numberOfCoconuts > 2 ? 'tired' : 'average';
    case 'NorwegianBlueParrot':
      return bird.voltage > 100 ? 'scorched' : 'beautiful';
    default:
      return 'unknown';
  }
}

export function airSpeedVelocity(bird) {
  switch (bird.type) {
    case 'EuropeanSwallow':
      return 35;
    case 'AfricanSwallow':
      return 40 - 2 * bird.numberOfCoconuts;
    case 'NorwegianBlueParrot':
      return bird.isNailed ? 0 : 10 + bird.voltage / 10;
    default:
      return null;
  }
}
```

#### Test suite

The acompanioning test suite for this example covers all variations for both functions, building a solid safety net for us to freely modify the code.

```javascript
describe('plumage', () => {
  it('should return "average" for EuropeanSwallow', () => {
    const bird = { type: 'EuropeanSwallow' };
    expect(plumage(bird)).toBe('average');
  });

  it('should return "tired" for AfricanSwallow with more than 2 coconuts', () => {
    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 3 };
    expect(plumage(bird)).toBe('tired');
  });

  it('should return "average" for AfricanSwallow with 2 or less coconuts', () => {
    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 2 };
    expect(plumage(bird)).toBe('average');
  });

  it('should return "scorched" for NorwegianBlueParrot with voltage greater than 100', () => {
    const bird = { type: 'NorwegianBlueParrot', voltage: 101 };
    expect(plumage(bird)).toBe('scorched');
  });

  it('should return "beautiful" for NorwegianBlueParrot with voltage 100 or less', () => {
    const bird = { type: 'NorwegianBlueParrot', voltage: 100 };
    expect(plumage(bird)).toBe('beautiful');
  });

  it('should return "unknown" for unknown bird type', () => {
    const bird = { type: 'Unknown' };
    expect(plumage(bird)).toBe('unknown');
  });
});

describe('plumages', () => {
  it('should return a map containing the plumage of all birds in the list', () => {
    const birds = [
      { name: 'bird1', type: 'EuropeanSwallow' },
      { name: 'bird2', type: 'AfricanSwallow', numberOfCoconuts: 1 },
      { name: 'bird3', type: 'AfricanSwallow', numberOfCoconuts: 3 },
      { name: 'bird4', type: 'NorwegianBlueParrot', voltage: 100 },
      { name: 'bird5', type: 'NorwegianBlueParrot', voltage: 101 },
      { name: 'bird6', type: 'Unknown' },
    ];

    const result = plumages(birds);

    expect(result.size).toBe(6);
    expect(result.get('bird1')).toBe(plumage(birds[0]));
    expect(result.get('bird2')).toBe(plumage(birds[1]));
    expect(result.get('bird3')).toBe(plumage(birds[2]));
    expect(result.get('bird4')).toBe(plumage(birds[3]));
    expect(result.get('bird5')).toBe(plumage(birds[4]));
    expect(result.get('bird6')).toBe(plumage(birds[5]));
  });
});

describe('airSpeedVelocity', () => {
  it('should return 35 for EuropeanSwallow', () => {
    const bird = { type: 'EuropeanSwallow' };
    expect(airSpeedVelocity(bird)).toBe(35);
  });

  it('should return 38 for AfricanSwallow with 1 coconut', () => {
    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 1 };
    expect(airSpeedVelocity(bird)).toBe(38);
  });

  it('should return 36 for AfricanSwallow with 2 coconuts', () => {
    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 2 };
    expect(airSpeedVelocity(bird)).toBe(36);
  });

  it('should return 0 for nailed NorwegianBlueParrot', () => {
    const bird = { type: 'NorwegianBlueParrot', isNailed: true };
    expect(airSpeedVelocity(bird)).toBe(0);
  });

  it('should return 10 for NorwegianBlueParrot with voltage 0', () => {
    const bird = { type: 'NorwegianBlueParrot', voltage: 0 };
    expect(airSpeedVelocity(bird)).toBe(10);
  });

  it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
    const bird = { type: 'NorwegianBlueParrot', voltage: 100 };
    expect(airSpeedVelocity(bird)).toBe(20);
  });
});

describe('speeds', () => {
  it('should return a map containing the air speed velocity of all birds in the list', () => {
    const birds = [
      { name: 'bird1', type: 'EuropeanSwallow' },
      { name: 'bird2', type: 'AfricanSwallow', numberOfCoconuts: 1 },
      { name: 'bird3', type: 'AfricanSwallow', numberOfCoconuts: 2 },
      { name: 'bird4', type: 'NorwegianBlueParrot', voltage: 100 },
      { name: 'bird5', type: 'NorwegianBlueParrot', voltage: 50 },
      { name: 'bird6', type: 'Unknown' },
    ];

    const result = speeds(birds);

    expect(result.size).toBe(6);
    expect(result.get('bird1')).toBe(35);
    expect(result.get('bird2')).toBe(38);
    expect(result.get('bird3')).toBe(36);
    expect(result.get('bird4')).toBe(20);
    expect(result.get('bird5')).toBe(15);
    expect(result.get('bird6')).toBe(null);
  });
});
```

As we go, since we're going to introduce some classes, most of these tests are going to be migrated to a different file. Personally, though, I like to keep the initial tests in place until the very last moment of the refactoring. I feel like it brings extra safety and comfort in the form of a "double check".

#### Steps

We start by introducing a `Bird` class. This class has the same implementation of `plumage` and `airSpeedVelocity`, with the only difference being references to `this`:

```diff
@@ -0,0 +1,31 @@
+export class Bird {
+  constructor(birdObject) {
+    Object.assign(this, birdObject);
+  }
+
+  get plumage() {
+    switch (this.type) {
+      case 'EuropeanSwallow':
+        return 'average';
+      case 'AfricanSwallow':
+        return this.numberOfCoconuts > 2 ? 'tired' : 'average';
+      case 'NorwegianBlueParrot':
+        return this.voltage > 100 ? 'scorched' : 'beautiful';
+      default:
+        return 'unknown';
+    }
+  }
+
+  get airSpeedVelocity() {
+    switch (this.type) {
+      case 'EuropeanSwallow':
+        return 35;
+      case 'AfricanSwallow':
+        return 40 - 2 * this.numberOfCoconuts;
+      case 'NorwegianBlueParrot':
+        return this.isNailed ? 0 : 10 + this.voltage / 10;
+      default:
+        return null;
+    }
+  }
+}

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -0,0 +1,72 @@
+import { Bird } from './index';
+
+describe('Bird', () => {
+  describe('plumage', () => {
+    it('should return "average" for EuropeanSwallow', () => {
+      const bird = new Bird({ type: 'EuropeanSwallow' });
+      expect(bird.plumage).toBe('average');
+    });
+
+    it('should return "tired" for AfricanSwallow with more than 2 coconuts', () => {
+      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 3 });
+      expect(bird.plumage).toBe('tired');
+    });
+
+    it('should return "average" for AfricanSwallow with 2 or less coconuts', () => {
+      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
+      expect(bird.plumage).toBe('average');
+    });
+
+    it('should return "scorched" for NorwegianBlueParrot with voltage greater than 100', () => {
+      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 101 });
+      expect(bird.plumage).toBe('scorched');
+    });
+
+    it('should return "beautiful" for NorwegianBlueParrot with voltage 100 or less', () => {
+      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 100 });
+      expect(bird.plumage).toBe('beautiful');
+    });
+
+    it('should return "unknown" for unknown bird type', () => {
+      const bird = new Bird({ type: 'Unknown' });
+      expect(bird.plumage).toBe('unknown');
+    });
+  });
+
+  describe('airSpeedVelocity', () => {
+    it('should return 35 for EuropeanSwallow', () => {
+      const bird = new Bird({ type: 'EuropeanSwallow' });
+      expect(bird.airSpeedVelocity).toBe(35);
+    });
+
+    it('should return 38 for AfricanSwallow with 1 coconut', () => {
+      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 1 });
+      expect(bird.airSpeedVelocity).toBe(38);
+    });
+
+    it('should return 36 for AfricanSwallow with 2 coconuts', () => {
+      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
+      expect(bird.airSpeedVelocity).toBe(36);
+    });
+
+    it('should return 0 for nailed NorwegianBlueParrot', () => {
+      const bird = new Bird({ type: 'NorwegianBlueParrot', isNailed: true });
+      expect(bird.airSpeedVelocity).toBe(0);
+    });
+
+    it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
+      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 100 });
+      expect(bird.airSpeedVelocity).toBe(20);
+    });
+
+    it('should return 15 for NorwegianBlueParrot with voltage 50', () => {
+      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 50 });
+      expect(bird.airSpeedVelocity).toBe(15);
+    });
+
+    it('should return null for unknown bird type', () => {
+      const bird = new Bird({ type: 'Unknown' });
+      expect(bird.airSpeedVelocity).toBe(null);
+    });
+  });
+});
```

With the class in place, we can then delegate update the implementation of the `plumage` function to delegate to `Bird.plumage`:

```diff
@@ -1,3 +1,5 @@
+import { Bird } from './bird';
+
 export function plumages(birds) {
   return new Map(birds.map(b => [b.name, plumage(b)]));
 }
@@ -7,16 +9,7 @@ export function speeds(birds) {
 }
 export function plumage(bird) {
-  switch (bird.type) {
-    case 'EuropeanSwallow':
-      return 'average';
-    case 'AfricanSwallow':
-      return bird.numberOfCoconuts > 2 ? 'tired' : 'average';
-    case 'NorwegianBlueParrot':
-      return bird.voltage > 100 ? 'scorched' : 'beautiful';
-    default:
-      return 'unknown';
-  }
+  return new Bird(bird).plumage;
 }
 export function airSpeedVelocity(bird) {
```

We do the same for `airSpeedVelocity`:

```diff
@@ -13,14 +13,5 @@ export function plumage(bird) {
 }
 export function airSpeedVelocity(bird) {
-  switch (bird.type) {
-    case 'EuropeanSwallow':
-      return 35;
-    case 'AfricanSwallow':
-      return 40 - 2 * bird.numberOfCoconuts;
-    case 'NorwegianBlueParrot':
-      return bird.isNailed ? 0 : 10 + bird.voltage / 10;
-    default:
-      return null;
-  }
+  return new Bird(bird).airSpeedVelocity;
 }
```

Then, we can start to implement subclasses of `Bird`:

```diff
@@ -29,3 +29,9 @@ export class Bird {
     }
   }
 }
+
+export class EuropeanSwallow extends Bird {}
+
+export class AfricanSwallow extends Bird {}
+
+export class NorwegianBlueParrot extends Bird {}
```

At this point, we'll need a factory to instantiate the correct subclass based on the `Bird` type. This is the pivotal point of this refactoring, since this is the only `switch/case` statement we'll need for this implementation, compared to the several ones we would potentially have:

```diff
@@ -35,3 +35,16 @@ export class EuropeanSwallow extends Bird {}
 export class AfricanSwallow extends Bird {}
 export class NorwegianBlueParrot extends Bird {}
+
+export function createBird(birdObject) {
+  switch (birdObject.type) {
+    case 'EuropeanSwallow':
+      return new EuropeanSwallow(birdObject);
+    case 'AfricanSwallow':
+      return new AfricanSwallow(birdObject);
+    case 'NorwegianBlueParrot':
+      return new NorwegianBlueParrot(birdObject);
+    default:
+      return new Bird(birdObject);
+  }
+}

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -1,4 +1,4 @@
-import { Bird } from './index';
+import { Bird, EuropeanSwallow, AfricanSwallow, NorwegianBlueParrot, createBird } from './index';
 describe('Bird', () => {
   describe('plumage', () => {
@@ -70,3 +70,25 @@ describe('Bird', () => {
     });
   });
 });
+
+describe('createBird', () => {
+  it('should return an instance of EuropeanSwallow for type EuropeanSwallow', () => {
+    const bird = { type: 'EuropeanSwallow' };
+    expect(createBird(bird)).toBeInstanceOf(EuropeanSwallow);
+  });
+
+  it('should return an instance of AfricanSwallow for type AfricanSwallow', () => {
+    const bird = { type: 'AfricanSwallow' };
+    expect(createBird(bird)).toBeInstanceOf(AfricanSwallow);
+  });
+
+  it('should return an instance of NorwegianBlueParrot for type NorwegianBlueParrot', () => {
+    const bird = { type: 'NorwegianBlueParrot' };
+    expect(createBird(bird)).toBeInstanceOf(NorwegianBlueParrot);
+  });
+
+  it('should return an instance of Bird for unknown type', () => {
+    const bird = { type: 'Unknown' };
+    expect(createBird(bird)).toBeInstanceOf(Bird);
+  });
+});
```

Now, we can start to migrate specific behavior to each subclass. We start by implementing `get plumage()` at `EuropeanSwallow`:

```diff
@@ -30,7 +30,11 @@ export class Bird {
   }
 }
-export class EuropeanSwallow extends Bird {}
+export class EuropeanSwallow extends Bird {
+  get plumage() {
+    return 'average';
+  }
+}
 export class AfricanSwallow extends Bird {}

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -71,6 +71,15 @@ describe('Bird', () => {
   });
 });
+describe('EuropeanSwallow', () => {
+  describe('plumage', () => {
+    it('should return "average"', () => {
+      const bird = new EuropeanSwallow({ type: 'EuropeanSwallow' });
+      expect(bird.plumage).toBe('average');
+    });
+  });
+});
+
 describe('createBird', () => {
   it('should return an instance of EuropeanSwallow for type EuropeanSwallow', () => {
     const bird = { type: 'EuropeanSwallow' };
```

To start making use of the subclasses, we now need to invoke our `createBird` factory function at `plumage`:

```diff
@@ -1,4 +1,4 @@
-import { Bird } from './bird';
+import { Bird, createBird } from './bird';
 export function plumages(birds) {
   return new Map(birds.map(b => [b.name, plumage(b)]));
@@ -9,7 +9,7 @@ export function speeds(birds) {
 }
 export function plumage(bird) {
-  return new Bird(bird).plumage;
+  return createBird(bird).plumage;
 }
 export function airSpeedVelocity(bird) {
```

To be sure clients are using an instance of `EuropeanSwallow` when invoking `get plumage()`, we throw an error at the base class:

```diff
@@ -6,7 +6,7 @@ export class Bird {
   get plumage() {
     switch (this.type) {
       case 'EuropeanSwallow':
-        return 'average';
+        throw 'oops';
       case 'AfricanSwallow':
         return this.numberOfCoconuts > 2 ? 'tired' : 'average';
       case 'NorwegianBlueParrot':

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -2,9 +2,9 @@ import { Bird, EuropeanSwallow, AfricanSwallow, NorwegianBlueParrot, createBird
 describe('Bird', () => {
   describe('plumage', () => {
-    it('should return "average" for EuropeanSwallow', () => {
+    it('should throw an error if bird type is EuropeanSwallow', () => {
       const bird = new Bird({ type: 'EuropeanSwallow' });
-      expect(bird.plumage).toBe('average');
+      expect(() => bird.plumage).toThrow('oops');
     });
     it('should return "tired" for AfricanSwallow with more than 2 coconuts', () => {
```

We now do the same for `AfricanSwallow`:

```diff
@@ -36,7 +36,11 @@ export class EuropeanSwallow extends Bird {
   }
 }
-export class AfricanSwallow extends Bird {}
+export class AfricanSwallow extends Bird {
+  get plumage() {
+    return this.numberOfCoconuts > 2 ? 'tired' : 'average';
+  }
+}
 export class NorwegianBlueParrot extends Bird {}

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -80,6 +80,20 @@ describe('EuropeanSwallow', () => {
   });
 });
+describe('AfricanSwallow', () => {
+  describe('plumage', () => {
+    it('should return "tired" for more than 2 coconuts', () => {
+      const bird = new AfricanSwallow({ type: 'AfricanSwallow', numberOfCoconuts: 3 });
+      expect(bird.plumage).toBe('tired');
+    });
+
+    it('should return "average" for 2 or less coconuts', () => {
+      const bird = new AfricanSwallow({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
+      expect(bird.plumage).toBe('average');
+    });
+  });
+});
+
 describe('createBird', () => {
   it('should return an instance of EuropeanSwallow for type EuropeanSwallow', () => {
     const bird = { type: 'EuropeanSwallow' };
```

And also throw an error at the base class:

```diff
@@ -6,9 +6,8 @@ export class Bird {
   get plumage() {
     switch (this.type) {
       case 'EuropeanSwallow':
-        throw 'oops';
       case 'AfricanSwallow':
-        return this.numberOfCoconuts > 2 ? 'tired' : 'average';
+        throw 'oops';
       case 'NorwegianBlueParrot':
         return this.voltage > 100 ? 'scorched' : 'beautiful';
       default:

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -7,14 +7,9 @@ describe('Bird', () => {
       expect(() => bird.plumage).toThrow('oops');
     });
-    it('should return "tired" for AfricanSwallow with more than 2 coconuts', () => {
-      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 3 });
-      expect(bird.plumage).toBe('tired');
-    });
-
-    it('should return "average" for AfricanSwallow with 2 or less coconuts', () => {
-      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
-      expect(bird.plumage).toBe('average');
+    it('should throw an error if bird type is AfricanSwallow', () => {
+      const bird = new Bird({ type: 'AfricanSwallow' });
+      expect(() => bird.plumage).toThrow('oops');
     });
     it('should return "scorched" for NorwegianBlueParrot with voltage greater than 100', () => {
```

And we do the same for `NorwegianBlueParrot`:

```diff
@@ -41,7 +41,11 @@ export class AfricanSwallow extends Bird {
   }
 }
-export class NorwegianBlueParrot extends Bird {}
+export class NorwegianBlueParrot extends Bird {
+  get plumage() {
+    return this.voltage > 100 ? 'scorched' : 'beautiful';
+  }
+}
 export function createBird(birdObject) {
   switch (birdObject.type) {

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -89,6 +89,25 @@ describe('AfricanSwallow', () => {
   });
 });
+describe('NorwegianBlueParrot', () => {
+  describe('plumage', () => {
+    it('should return 0 for nailed NorwegianBlueParrot', () => {
+      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', isNailed: true });
+      expect(bird.airSpeedVelocity).toBe(0);
+    });
+
+    it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
+      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', voltage: 100 });
+      expect(bird.airSpeedVelocity).toBe(20);
+    });
+
+    it('should return 15 for NorwegianBlueParrot with voltage 50', () => {
+      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', voltage: 50 });
+      expect(bird.airSpeedVelocity).toBe(15);
+    });
+  });
+});
+
 describe('createBird', () => {
   it('should return an instance of EuropeanSwallow for type EuropeanSwallow', () => {
     const bird = { type: 'EuropeanSwallow' };
```

At this point, the only thing left at the base class is the "unknown" value, which we keep. We also remove the tests, since they're all reimplemented in the subclasses' test suites:

```diff
@@ -4,15 +4,7 @@ export class Bird {
   }
   get plumage() {
-    switch (this.type) {
-      case 'EuropeanSwallow':
-      case 'AfricanSwallow':
-        throw 'oops';
-      case 'NorwegianBlueParrot':
-        return this.voltage > 100 ? 'scorched' : 'beautiful';
-      default:
-        return 'unknown';
-    }
+    return 'unknown';
   }
   get airSpeedVelocity() {

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -2,27 +2,7 @@ import { Bird, EuropeanSwallow, AfricanSwallow, NorwegianBlueParrot, createBird
 describe('Bird', () => {
   describe('plumage', () => {
-    it('should throw an error if bird type is EuropeanSwallow', () => {
-      const bird = new Bird({ type: 'EuropeanSwallow' });
-      expect(() => bird.plumage).toThrow('oops');
-    });
-
-    it('should throw an error if bird type is AfricanSwallow', () => {
-      const bird = new Bird({ type: 'AfricanSwallow' });
-      expect(() => bird.plumage).toThrow('oops');
-    });
-
-    it('should return "scorched" for NorwegianBlueParrot with voltage greater than 100', () => {
-      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 101 });
-      expect(bird.plumage).toBe('scorched');
-    });
-
-    it('should return "beautiful" for NorwegianBlueParrot with voltage 100 or less', () => {
-      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 100 });
-      expect(bird.plumage).toBe('beautiful');
-    });
-
-    it('should return "unknown" for unknown bird type', () => {
+    it('should return "unknown"', () => {
       const bird = new Bird({ type: 'Unknown' });
       expect(bird.plumage).toBe('unknown');
     });
```

Since we're done with `plumage`, we now do the same for `airSpeedVelocity`. We start with `EuropeanSwallow`:

```diff
@@ -25,6 +25,10 @@ export class EuropeanSwallow extends Bird {
   get plumage() {
     return 'average';
   }
+
+  get airSpeedVelocity() {
+    return 35;
+  }
 }
 export class AfricanSwallow extends Bird {

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -53,6 +53,13 @@ describe('EuropeanSwallow', () => {
       expect(bird.plumage).toBe('average');
     });
   });
+
+  describe('airSpeedVelocity', () => {
+    it('should return 35', () => {
+      const bird = new EuropeanSwallow({ type: 'EuropeanSwallow' });
+      expect(bird.airSpeedVelocity).toBe(35);
+    });
+  });
 });
 describe('AfricanSwallow', () => {
```

Then `AfricanSwallow`:

```diff
@@ -35,6 +35,10 @@ export class AfricanSwallow extends Bird {
   get plumage() {
     return this.numberOfCoconuts > 2 ? 'tired' : 'average';
   }
+
+  get airSpeedVelocity() {
+    return 40 - 2 * this.numberOfCoconuts;
+  }
 }
 export class NorwegianBlueParrot extends Bird {

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -74,6 +74,18 @@ describe('AfricanSwallow', () => {
       expect(bird.plumage).toBe('average');
     });
   });
+
+  describe('airSpeedVelocity', () => {
+    it('should return 38 for 1 coconut', () => {
+      const bird = new AfricanSwallow({ type: 'AfricanSwallow', numberOfCoconuts: 1 });
+      expect(bird.airSpeedVelocity).toBe(38);
+    });
+
+    it('should return 36 for 2 coconuts', () => {
+      const bird = new AfricanSwallow({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
+      expect(bird.airSpeedVelocity).toBe(36);
+    });
+  });
 });
 describe('NorwegianBlueParrot', () => {
```

And, finally, `NorwegianBlueParrot`:

```diff
@@ -45,6 +45,10 @@ export class NorwegianBlueParrot extends Bird {
   get plumage() {
     return this.voltage > 100 ? 'scorched' : 'beautiful';
   }
+
+  get airSpeedVelocity() {
+    return this.isNailed ? 0 : 10 + this.voltage / 10;
+  }
 }
 export function createBird(birdObject) {

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -105,6 +105,23 @@ describe('NorwegianBlueParrot', () => {
       expect(bird.airSpeedVelocity).toBe(15);
     });
   });
+
+  describe('airSpeedVelocity', () => {
+    it('should return 0 for nailed NorwegianBlueParrot', () => {
+      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', isNailed: true });
+      expect(bird.airSpeedVelocity).toBe(0);
+    });
+
+    it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
+      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', voltage: 100 });
+      expect(bird.airSpeedVelocity).toBe(20);
+    });
+
+    it('should return 15 for NorwegianBlueParrot with voltage 50', () => {
+      const bird = new NorwegianBlueParrot({ type: 'NorwegianBlueParrot', voltage: 50 });
+      expect(bird.airSpeedVelocity).toBe(15);
+    });
+  });
 });
 describe('createBird', () => {
```

Now, we can use the `createBird` factory function at `airSpeedVelocity`:

```diff
@@ -13,5 +13,5 @@ export function plumage(bird) {
 }
 export function airSpeedVelocity(bird) {
-  return new Bird(bird).airSpeedVelocity;
+  return createBird(bird).airSpeedVelocity;
 }
```

And just return `null` as the base value for `airSpeedVelocity`:

```diff
@@ -8,16 +8,7 @@ export class Bird {
   }
   get airSpeedVelocity() {
-    switch (this.type) {
-      case 'EuropeanSwallow':
-        return 35;
-      case 'AfricanSwallow':
-        return 40 - 2 * this.numberOfCoconuts;
-      case 'NorwegianBlueParrot':
-        return this.isNailed ? 0 : 10 + this.voltage / 10;
-      default:
-        return null;
-    }
+    return null;
   }
 }

diff --git a/src/functions-into-class-hierarchy/bird/index.test.js b/src/functions-into-class-hierarchy/bird/index.test.js
@@ -9,37 +9,7 @@ describe('Bird', () => {
   });
   describe('airSpeedVelocity', () => {
-    it('should return 35 for EuropeanSwallow', () => {
-      const bird = new Bird({ type: 'EuropeanSwallow' });
-      expect(bird.airSpeedVelocity).toBe(35);
-    });
-
-    it('should return 38 for AfricanSwallow with 1 coconut', () => {
-      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 1 });
-      expect(bird.airSpeedVelocity).toBe(38);
-    });
-
-    it('should return 36 for AfricanSwallow with 2 coconuts', () => {
-      const bird = new Bird({ type: 'AfricanSwallow', numberOfCoconuts: 2 });
-      expect(bird.airSpeedVelocity).toBe(36);
-    });
-
-    it('should return 0 for nailed NorwegianBlueParrot', () => {
-      const bird = new Bird({ type: 'NorwegianBlueParrot', isNailed: true });
-      expect(bird.airSpeedVelocity).toBe(0);
-    });
-
-    it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
-      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 100 });
-      expect(bird.airSpeedVelocity).toBe(20);
-    });
-
-    it('should return 15 for NorwegianBlueParrot with voltage 50', () => {
-      const bird = new Bird({ type: 'NorwegianBlueParrot', voltage: 50 });
-      expect(bird.airSpeedVelocity).toBe(15);
-    });
-
-    it('should return null for unknown bird type', () => {
+    it('should return null', () => {
       const bird = new Bird({ type: 'Unknown' });
       expect(bird.airSpeedVelocity).toBe(null);
     });
```

As a final touch, we can inline `plumage` at `plumages`:

```diff
@@ -1,17 +1,13 @@
-import { Bird, createBird } from './bird';
+import { createBird } from './bird';
 export function plumages(birds) {
-  return new Map(birds.map(b => [b.name, plumage(b)]));
+  return new Map(birds.map(b => createBird(b)).map(b => [b.name, b.plumage]));
 }
 export function speeds(birds) {
   return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
 }
-export function plumage(bird) {
-  return createBird(bird).plumage;
-}
-
 export function airSpeedVelocity(bird) {
   return createBird(bird).airSpeedVelocity;
 }
diff --git a/src/functions-into-class-hierarchy/index.test.js b/src/functions-into-class-hierarchy/index.test.js
index 950dbd6..3af458e 100644
@@ -1,36 +1,4 @@
-import { speeds, airSpeedVelocity, plumage, plumages } from './index';
-
-describe('plumage', () => {
-  it('should return "average" for EuropeanSwallow', () => {
-    const bird = { type: 'EuropeanSwallow' };
-    expect(plumage(bird)).toBe('average');
-  });
-
-  it('should return "tired" for AfricanSwallow with more than 2 coconuts', () => {
-    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 3 };
-    expect(plumage(bird)).toBe('tired');
-  });
-
-  it('should return "average" for AfricanSwallow with 2 or less coconuts', () => {
-    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 2 };
-    expect(plumage(bird)).toBe('average');
-  });
-
-  it('should return "scorched" for NorwegianBlueParrot with voltage greater than 100', () => {
-    const bird = { type: 'NorwegianBlueParrot', voltage: 101 };
-    expect(plumage(bird)).toBe('scorched');
-  });
-
-  it('should return "beautiful" for NorwegianBlueParrot with voltage 100 or less', () => {
-    const bird = { type: 'NorwegianBlueParrot', voltage: 100 };
-    expect(plumage(bird)).toBe('beautiful');
-  });
-
-  it('should return "unknown" for unknown bird type', () => {
-    const bird = { type: 'Unknown' };
-    expect(plumage(bird)).toBe('unknown');
-  });
-});
+import { speeds, airSpeedVelocity, plumages } from './index';
 describe('plumages', () => {
   it('should return a map containing the plumage of all birds in the list', () => {
@@ -46,12 +14,12 @@ describe('plumages', () => {
     const result = plumages(birds);
     expect(result.size).toBe(6);
-    expect(result.get('bird1')).toBe(plumage(birds[0]));
-    expect(result.get('bird2')).toBe(plumage(birds[1]));
-    expect(result.get('bird3')).toBe(plumage(birds[2]));
-    expect(result.get('bird4')).toBe(plumage(birds[3]));
-    expect(result.get('bird5')).toBe(plumage(birds[4]));
-    expect(result.get('bird6')).toBe(plumage(birds[5]));
+    expect(result.get('bird1')).toBe('average');
+    expect(result.get('bird2')).toBe('average');
+    expect(result.get('bird3')).toBe('tired');
+    expect(result.get('bird4')).toBe('beautiful');
+    expect(result.get('bird5')).toBe('scorched');
+    expect(result.get('bird6')).toBe('unknown');
   });
 });
```

and do the same with `airSpeedVelocity` at `speeds`:

```diff
@@ -5,9 +5,5 @@ export function plumages(birds) {
 }
 export function speeds(birds) {
-  return new Map(birds.map(b => [b.name, airSpeedVelocity(b)]));
-}
-
-export function airSpeedVelocity(bird) {
-  return createBird(bird).airSpeedVelocity;
+  return new Map(birds.map(b => createBird(b)).map(b => [b.name, b.airSpeedVelocity]));
 }
diff --git a/src/functions-into-class-hierarchy/index.test.js b/src/functions-into-class-hierarchy/index.test.js
index 3af458e..d641d8c 100644
@@ -1,4 +1,4 @@
-import { speeds, airSpeedVelocity, plumages } from './index';
+import { speeds, plumages } from './index';
 describe('plumages', () => {
   it('should return a map containing the plumage of all birds in the list', () => {
@@ -23,38 +23,6 @@ describe('plumages', () => {
   });
 });
-describe('airSpeedVelocity', () => {
-  it('should return 35 for EuropeanSwallow', () => {
-    const bird = { type: 'EuropeanSwallow' };
-    expect(airSpeedVelocity(bird)).toBe(35);
-  });
-
-  it('should return 38 for AfricanSwallow with 1 coconut', () => {
-    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 1 };
-    expect(airSpeedVelocity(bird)).toBe(38);
-  });
-
-  it('should return 36 for AfricanSwallow with 2 coconuts', () => {
-    const bird = { type: 'AfricanSwallow', numberOfCoconuts: 2 };
-    expect(airSpeedVelocity(bird)).toBe(36);
-  });
-
-  it('should return 0 for nailed NorwegianBlueParrot', () => {
-    const bird = { type: 'NorwegianBlueParrot', isNailed: true };
-    expect(airSpeedVelocity(bird)).toBe(0);
-  });
-
-  it('should return 10 for NorwegianBlueParrot with voltage 0', () => {
-    const bird = { type: 'NorwegianBlueParrot', voltage: 0 };
-    expect(airSpeedVelocity(bird)).toBe(10);
-  });
-
-  it('should return 20 for NorwegianBlueParrot with voltage 100', () => {
-    const bird = { type: 'NorwegianBlueParrot', voltage: 100 };
-    expect(airSpeedVelocity(bird)).toBe(20);
-  });
-});
-
 describe('speeds', () => {
   it('should return a map containing the air speed velocity of all birds in the list', () => {
     const birds = [
```

And that's it for this refactoring! Each bird has its own subclass now, particular behavior is encapsulated, and the usage of its props is streamlined.

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                                   | Message                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| [8b304cb](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/8b304cbf06413361f119d00959323cc8b5ad59ba) | introduce `Bird` class                                                   |
| [c2ec087](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/c2ec0875acc61d5f13fe77b9d15f819c5805c5bc) | delegate call to `plumage` to `Bird.plumage`                             |
| [be2e7cf](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/be2e7cfce2724c851c2efc51490f310cdaaf116a) | delegate call to `airSpeedVelocity` to `Bird.airSpeedVelocity`           |
| [33caeae](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/33caeae6776bffff93476ca0227a5d1980ebacb1) | introduce subclasses of `Bird`                                           |
| [ba6a293](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/ba6a29394796398a94fc41416a54f9f71c45209f) | introduce factory function to create subclasses of `Bird`                |
| [164ccf5](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/164ccf5803e22f2c09787e76cc8a3d52d3bfb09b) | implement specific plumage beahvior for `EuropeanSwallow`                |
| [61566c2](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/61566c26183cd2153c2db4edea85e4578ad1eb45) | use `createBird` factory function at `plumage`                           |
| [4f3c430](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/4f3c43063a1c3e15e7de341070c501a646dccfd7) | throw an error when accessing `Bird.plumage` for `EuropeanSwallow`       |
| [7dd58c4](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/7dd58c43d81f7066039aac36c185a6ce9cbbf4e0) | implement specific plumage beahvior for `AfricanSwallow`                 |
| [ccc299b](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/ccc299bc72c87e44a4b4aa424ef45450855214d0) | throw an error when accessing `Bird.plumage` for `AfricanSwallow`        |
| [2994b25](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/2994b2582735f14e89b8fcc8a944c718a5d5a93c) | implement specific plumage beahvior for `NorwegianBlueParrot`            |
| [93d99b4](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/93d99b453b509e3c8a62b389612000dc27216318) | return unknown as base value for `Bird.plumage`                          |
| [f3a975f](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/f3a975f35ad9a780281fb467e55d4659fd7843c6) | implement specific air speed velocity beahvior for `EuropeanSwallow`     |
| [0eeb3e0](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/0eeb3e0988b8a2a472a4b180f746d57d23f4306d) | implement specific air speed velocity beahvior for `AfricanSwallow`      |
| [80a1d0e](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/80a1d0e75bcf23fdb471a6b1afad21f67d8ae1c1) | implement specific air speed velocity beahvior for `NorwegianBlueParrot` |
| [8240d94](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/8240d94f4466aabe09b17fa65e42754114591fd5) | use createBird factory function at `airSpeedVelocity`                    |
| [2797cf5](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/2797cf572b96b29c493037cc8a2883918c6bdf23) | return null as base value for `Bird.airSpeedVelocity`                    |
| [0a30a70](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/0a30a70202a2ea6fc6508b65686e63ccca916164) | inline `plumage` at `plumages`                                           |
| [00ddc6a](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/00ddc6ad2688527f46acbc2e5c78df80c3e3ea4c) | inline `airSpeedVelocity` at `speeds`                                    |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commits/main).

### Example #2: Using polymorphism for variation

In this example, we have a system (code below) responsible for calculating the risk of a voyage, depending on several props such as the captain's trip history, the zone of the voyage, and a profit factor. In the implemented logic, there is some special code implemented to handle cases where the voyage zone is China and when the captain is experienced. This behavior deviates from the main implementation, and that's what we want to encapsulate.

```javascript
export function rating(voyage, history) {
  const vpf = voyageProfitFactor(voyage, history);
  const vr = voyageRisk(voyage);
  const chr = captainHistoryRisk(voyage, history);
  if (vpf * 3 > vr + chr * 2) return 'A';
  else return 'B';
}

export function voyageRisk(voyage) {
  let result = 1;
  if (voyage.length > 4) result += 2;
  if (voyage.length > 8) result += voyage.length - 8;
  if (['china', 'east-indies'].includes(voyage.zone)) result += 4;
  return Math.max(result, 0);
}

export function captainHistoryRisk(voyage, history) {
  let result = 1;
  if (history.length < 5) result += 4;
  result += history.filter(v => v.profit < 0).length;
  if (voyage.zone === 'china' && hasChina(history)) result -= 2;
  return Math.max(result, 0);
}

export function hasChina(history) {
  return history.some(v => 'china' === v.zone);
}

export function voyageProfitFactor(voyage, history) {
  let result = 2;
  if (voyage.zone === 'china') result += 1;
  if (voyage.zone === 'east-indies') result += 1;
  if (voyage.zone === 'china' && hasChina(history)) {
    result += 3;
    if (history.length > 10) result += 1;
    if (voyage.length > 12) result += 1;
    if (voyage.length > 18) result -= 1;
  } else {
    if (history.length > 8) result += 1;
    if (voyage.length > 14) result -= 1;
  }
  return result;
}
```

#### Test suite

The test suite built for this example, as always, covers all aspects of the implementation, creating a foundation for the upcoming refactoring session.

```javascript
import { voyageProfitFactor, hasChina, captainHistoryRisk, rating, voyageRisk } from '.';

const createHistory = ({ length, zone }) => Array.from({ length }, () => ({ zone }));

const emptyHistory = createHistory({ length: 0 });
const latamVoyage = { zone: 'latam' };
const chinaVoyage = { zone: 'china' };
const eastIndiesVoyage = { zone: 'east-indies' };

describe('rating', () => {
  it('should return "A" if voyage profit factor is 3 times greater than voyage risk plus captain history risk times 2', () => {
    const voyage = { zone: 'latam' };
    const history = createHistory({ length: 10, zone: 'latam' });
    expect(rating(voyage, history)).toEqual('A');
  });

  it('should return "B" if voyage profit factor is not 3 times greater than voyage risk plus captain history risk times 2', () => {
    const voyage = { zone: 'china' };
    const history = createHistory({ length: 1, zone: 'China' });
    expect(rating(voyage, history)).toEqual('B');
  });
});

describe('voyageRisk', () => {
  it('should return 1 as base value of voyage risk', () => {
    expect(voyageRisk(latamVoyage, emptyHistory)).toEqual(1);
  });

  it('should add 2 risk points if voyage length is greater than 4', () => {
    const voyage = { zone: 'latam', length: 5 };
    expect(voyageRisk(voyage, emptyHistory)).toEqual(3);
  });

  it('should add 1 risk point per voyage length above eight', () => {
    const voyage = { zone: 'latam', length: 9 };
    expect(voyageRisk(voyage, emptyHistory)).toEqual(4);
  });

  it('should add 4 risk points if voyage zone is China', () => {
    expect(voyageRisk(chinaVoyage, emptyHistory)).toEqual(5);
  });

  it('should add 4 risk points if voyage zone is East Indies', () => {
    expect(voyageRisk(eastIndiesVoyage, emptyHistory)).toEqual(5);
  });
});

describe('captainHistoryRisk', () => {
  it('should return 1 as base value of captain history risk', () => {
    const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
    expect(captainHistoryRisk(latamVoyage, fiveTripHistory)).toEqual(1);
  });

  it('should add 4 risk points if history has less than 5 trips', () => {
    const fourTripHistory = createHistory({ length: 4, zone: 'latam' });
    expect(captainHistoryRisk(latamVoyage, fourTripHistory)).toEqual(5);
  });

  it('should add 1 risk point for each trip with negative profit', () => {
    const history = [{ profit: 1 }, { profit: -1 }, { profit: -2 }, { profit: 2 }, { profit: 2 }];
    expect(captainHistoryRisk(latamVoyage, history)).toEqual(3);
  });

  it('should remove 2 risk points if captain has been to China and voyage zone is China', () => {
    const history = [{ zone: 'china' }];
    expect(captainHistoryRisk(chinaVoyage, history)).toEqual(3);
  });

  it('should return zero if captain history risk is negative', () => {
    const history = [
      { zone: 'china', profit: 1 },
      { profit: 2 },
      { profit: 2 },
      { profit: 2 },
      { profit: 2 },
    ];

    expect(captainHistoryRisk(chinaVoyage, history)).toEqual(0);
  });
});

describe('voyageProfitFactor', () => {
  it('should return 2 as base value of profit factor', () => {
    expect(voyageProfitFactor(latamVoyage, emptyHistory)).toEqual(2);
  });

  it('should add 1 point to profit factor if voyage zone is east-indies', () => {
    expect(voyageProfitFactor(eastIndiesVoyage, emptyHistory)).toEqual(3);
  });

  describe('voyage is to China', () => {
    const captainTripsHistory = [chinaVoyage];

    it('should add 1 point to profit factor', () => {
      expect(voyageProfitFactor(chinaVoyage, emptyHistory)).toEqual(3);
    });

    describe('captain has experience with voyages to China', () => {
      it('should add 3 points to the profit factor', () => {
        expect(voyageProfitFactor(chinaVoyage, captainTripsHistory)).toEqual(6);
      });

      it('should add 1 more point if the captain has more than 10 trips in their history', () => {
        const history = createHistory({ length: 11, zone: 'china' });
        expect(voyageProfitFactor(chinaVoyage, history)).toEqual(7);
      });

      describe('voyage is long', () => {
        const history = createHistory({ length: 1, zone: 'china' });

        it('should add 1 more point if the voyage has a length greater than 12', () => {
          const longChinaVoyage = { ...chinaVoyage, length: 13 };
          expect(voyageProfitFactor(longChinaVoyage, history)).toEqual(7);
        });

        it('should remove 1 point if the voyage has a length greater than 18', () => {
          const longChinaVoyage = { ...chinaVoyage, length: 19 };
          expect(voyageProfitFactor(longChinaVoyage, history)).toEqual(6);
        });
      });
    });
  });

  describe('voyage is not to China', () => {
    it('should add 1 point if history has more than 8 trips', () => {
      const history = Array.from({ length: 9 }, () => latamVoyage);
      expect(voyageProfitFactor(latamVoyage, history)).toEqual(3);
    });

    it('should remove 1 point if voyage length is more than 14', () => {
      const voyage = { zone: 'latam', length: 15 };
      expect(voyageProfitFactor(voyage, emptyHistory)).toEqual(1);
    });
  });
});

describe('hasChina', () => {
  it('should return true if history has a trip to China', () => {
    const history = [{ zone: 'latam' }, { zone: 'china' }];
    expect(hasChina(history)).toBeTruthy();
  });

  it('should return false if history has no trip to China', () => {
    const history = [{ zone: 'latam' }, { zone: 'east-indies' }];
    expect(hasChina(history)).toBeFalsy();
  });

  it('should return false if history is empty', () => {
    expect(hasChina(emptyHistory)).toBeFalsy();
  });
});
```

The result is quite extensive, but that's what we need to be on the safe side.

#### Steps

Since we're going to use polymorphism, we start by introduce a base `Rating` class. Its implementation has the same code as the aforementioned isolated functions:

```diff
--- /dev/null
@@ -0,0 +1,49 @@
+export class Rating {
+  constructor(voyage, history) {
+    this.voyage = voyage;
+    this.history = history;
+  }
+
+  get value() {
+    const vpf = this.voyageProfitFactor;
+    const vr = this.voyageRisk;
+    const chr = this.captainHistoryRisk;
+    return vpf * 3 > vr + chr * 2 ? 'A' : 'B';
+  }
+
+  get voyageRisk() {
+    let result = 1;
+    if (this.voyage.length > 4) result += 2;
+    if (this.voyage.length > 8) result += this.voyage.length - 8;
+    if (['china', 'east-indies'].includes(this.voyage.zone)) result += 4;
+    return Math.max(result, 0);
+  }
+
+  get captainHistoryRisk() {
+    let result = 1;
+    if (this.history.length < 5) result += 4;
+    result += this.history.filter(v => v.profit < 0).length;
+    if (this.voyage.zone === 'china' && this.hasChinaHistory) result -= 2;
+    return Math.max(result, 0);
+  }
+
+  get voyageProfitFactor() {
+    let result = 2;
+    if (this.voyage.zone === 'china') result += 1;
+    if (this.voyage.zone === 'east-indies') result += 1;
+    if (this.voyage.zone === 'china' && this.hasChinaHistory) {
+      result += 3;
+      if (this.history.length > 10) result += 1;
+      if (this.voyage.length > 12) result += 1;
+      if (this.voyage.length > 18) result -= 1;
+    } else {
+      if (this.history.length > 8) result += 1;
+      if (this.voyage.length > 14) result -= 1;
+    }
+    return result;
+  }
+
+  get hasChinaHistory() {
+    return this.history.some(v => 'china' === v.zone);
+  }
+}

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
--- /dev/null
@@ -0,0 +1,177 @@
+import { Rating } from '.';
+
+const createHistory = ({ length, zone }) => Array.from({ length }, () => ({ zone }));
+
+const emptyHistory = createHistory({ length: 0 });
+const latamVoyage = { zone: 'latam' };
+const chinaVoyage = { zone: 'china' };
+const eastIndiesVoyage = { zone: 'east-indies' };
+
+describe('Rating', () => {
+  describe('value', () => {
+    it('should return "A" if voyage profit factor is 3 times greater than voyage risk plus captain history risk times 2', () => {
+      const voyage = { zone: 'latam' };
+      const history = createHistory({ length: 10, zone: 'latam' });
+      const rating = new Rating(voyage, history);
+      expect(rating.value).toEqual('A');
+    });
+
+    it('should return "B" if voyage profit factor is not 3 times greater than voyage risk plus captain history risk times 2', () => {
+      const voyage = { zone: 'china' };
+      const history = createHistory({ length: 1, zone: 'China' });
+      const rating = new Rating(voyage, history);
+      expect(rating.value).toEqual('B');
+    });
+  });
+
+  describe('voyageRisk', () => {
+    it('should return 1 as base value of voyage risk', () => {
+      const rating = new Rating(latamVoyage, emptyHistory);
+      expect(rating.voyageRisk).toEqual(1);
+    });
+
+    it('should add 2 risk points if voyage length is greater than 4', () => {
+      const voyage = { zone: 'latam', length: 5 };
+      const rating = new Rating(voyage, emptyHistory);
+      expect(rating.voyageRisk).toEqual(3);
+    });
+
+    it('should add 1 risk point per voyage length above eight', () => {
+      const voyage = { zone: 'latam', length: 9 };
+      const rating = new Rating(voyage, emptyHistory);
+      expect(rating.voyageRisk).toEqual(4);
+    });
+
+    it('should add 4 risk points if voyage zone is China', () => {
+      const rating = new Rating(chinaVoyage, emptyHistory);
+      expect(rating.voyageRisk).toEqual(5);
+    });
+
+    it('should add 4 risk points if voyage zone is East Indies', () => {
+      const rating = new Rating(eastIndiesVoyage, emptyHistory);
+      expect(rating.voyageRisk).toEqual(5);
+    });
+  });
+
+  describe('captainHistoryRisk', () => {
+    it('should return 1 as base value of captain history risk', () => {
+      const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
+      const rating = new Rating(latamVoyage, fiveTripHistory);
+      expect(rating.captainHistoryRisk).toEqual(1);
+    });
+
+    it('should add 4 risk points if history has less than 5 trips', () => {
+      const fourTripHistory = createHistory({ length: 4, zone: 'latam' });
+      const rating = new Rating(latamVoyage, fourTripHistory);
+      expect(rating.captainHistoryRisk).toEqual(5);
+    });
+
+    it('should add 1 risk point for each trip with negative profit', () => {
+      const history = [{ profit: 1 }, { profit: -1 }, { profit: -2 }, { profit: 2 }, { profit: 2 }];
+      const rating = new Rating(latamVoyage, history);
+      expect(rating.captainHistoryRisk).toEqual(3);
+    });
+
+    it('should remove 2 risk points if captain has been to China and voyage zone is China', () => {
+      const history = [{ zone: 'china' }];
+      const rating = new Rating(chinaVoyage, history);
+      expect(rating.captainHistoryRisk).toEqual(3);
+    });
+
+    it('should return zero if captain history risk is negative', () => {
+      const history = [
+        { zone: 'china', profit: 1 },
+        { profit: 2 },
+        { profit: 2 },
+        { profit: 2 },
+        { profit: 2 },
+      ];
+
+      const rating = new Rating(chinaVoyage, history);
+      expect(rating.captainHistoryRisk).toEqual(0);
+    });
+  });
+
+  describe('voyageProfitFactor', () => {
+    it('should return 2 as base value of profit factor', () => {
+      const rating = new Rating(latamVoyage, emptyHistory);
+      expect(rating.voyageProfitFactor).toEqual(2);
+    });
+
+    it('should add 1 point to profit factor if voyage zone is east-indies', () => {
+      const rating = new Rating(eastIndiesVoyage, emptyHistory);
+      expect(rating.voyageProfitFactor).toEqual(3);
+    });
+
+    describe('voyage is to China', () => {
+      const captainTripsHistory = [chinaVoyage];
+
+      it('should add 1 point to profit factor', () => {
+        const rating = new Rating(chinaVoyage, emptyHistory);
+        expect(rating.voyageProfitFactor).toEqual(3);
+      });
+
+      describe('captain has experience with voyages to China', () => {
+        it('should add 3 points to the profit factor', () => {
+          const rating = new Rating(chinaVoyage, captainTripsHistory);
+          expect(rating.voyageProfitFactor).toEqual(6);
+        });
+
+        it('should add 1 more point if the captain has more than 10 trips in their history', () => {
+          const history = createHistory({ length: 11, zone: 'china' });
+          const rating = new Rating(chinaVoyage, history);
+          expect(rating.voyageProfitFactor).toEqual(7);
+        });
+
+        describe('voyage is long', () => {
+          const history = createHistory({ length: 1, zone: 'china' });
+
+          it('should add 1 more point if the voyage has a length greater than 12', () => {
+            const longChinaVoyage = { ...chinaVoyage, length: 13 };
+            const rating = new Rating(longChinaVoyage, history);
+            expect(rating.voyageProfitFactor).toEqual(7);
+          });
+
+          it('should remove 1 point if the voyage has a length greater than 18', () => {
+            const longChinaVoyage = { ...chinaVoyage, length: 19 };
+            const rating = new Rating(longChinaVoyage, history);
+            expect(rating.voyageProfitFactor).toEqual(6);
+          });
+        });
+      });
+    });
+
+    describe('voyage is not to China', () => {
+      it('should add 1 point if history has more than 8 trips', () => {
+        const history = Array.from({ length: 9 }, () => latamVoyage);
+        const rating = new Rating(latamVoyage, history);
+        expect(rating.voyageProfitFactor).toEqual(3);
+      });
+
+      it('should remove 1 point if voyage length is more than 14', () => {
+        const voyage = { zone: 'latam', length: 15 };
+        const rating = new Rating(voyage, emptyHistory);
+        expect(rating.voyageProfitFactor).toEqual(1);
+      });
+    });
+  });
+
+  describe('hasChinaHistory', () => {
+    it('should return true if history has a trip to China', () => {
+      const history = [{ zone: 'latam' }, { zone: 'china' }];
+      const rating = new Rating(latamVoyage, history);
+      expect(rating.hasChinaHistory).toBeTruthy();
+    });
+
+    it('should return false if history has no trip to China', () => {
+      const history = [{ zone: 'latam' }, { zone: 'east-indies' }];
+      const rating = new Rating(latamVoyage, history);
+      expect(rating.hasChinaHistory).toBeFalsy();
+    });
+
+    it('should return false if history is empty', () => {
+      const rating = new Rating(latamVoyage, emptyHistory);
+      expect(rating.hasChinaHistory).toBeFalsy();
+    });
+  });
+});
```

Then, we introduce `ExperiencedChinaRating`, the subclass that will hold all the particular cases for China and voyage and history length:

```diff
@@ -47,3 +47,5 @@ export class Rating {
     return this.history.some(v => 'china' === v.zone);
   }
 }
+
+export class ExperiencedChinaRating extends Rating {}
diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
index 1b20565..0d1e3f9 100644
@@ -1,4 +1,4 @@
-import { Rating } from '.';
+import { Rating, ExperiencedChinaRating } from '.';
 const createHistory = ({ length, zone }) => Array.from({ length }, () => ({ zone }));
@@ -175,3 +175,109 @@ describe('Rating', () => {
     });
   });
 });
+
+describe('ExperiencedChinaRating', () => {
+  describe('value', () => {
+    it('should return "A" if voyage profit factor is 3 times greater than voyage risk plus captain history risk times 2', () => {
+      const voyage = { zone: 'latam' };
+      const history = createHistory({ length: 10, zone: 'latam' });
+      const rating = new ExperiencedChinaRating(voyage, history);
+      expect(rating.value).toEqual('A');
+    });
+
+    it('should return "B" if voyage profit factor is not 3 times greater than voyage risk plus captain history risk times 2', () => {
+      const voyage = { zone: 'china' };
+      const history = createHistory({ length: 1, zone: 'China' });
+      const rating = new ExperiencedChinaRating(voyage, history);
+      expect(rating.value).toEqual('B');
+    });
+  });
+
+  describe('voaygeRisk', () => {
+    describe('since voyage is always to China', () => {
+      it('should add 4 risk points to voyage risk', () => {
+        const rating = new ExperiencedChinaRating(chinaVoyage, emptyHistory);
+        expect(rating.voyageRisk).toEqual(5);
+      });
+    });
+  });
+
+  describe('captainHistoryRisk', () => {
+    it('should return 1 as base value of captain history risk', () => {
+      const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
+      const rating = new ExperiencedChinaRating(latamVoyage, fiveTripHistory);
+      expect(rating.captainHistoryRisk).toEqual(1);
+    });
+
+    it('should add 4 risk points if history has less than 5 trips', () => {
+      const fourTripHistory = createHistory({ length: 4, zone: 'latam' });
+      const rating = new ExperiencedChinaRating(latamVoyage, fourTripHistory);
+      expect(rating.captainHistoryRisk).toEqual(5);
+    });
+
+    it('should add 1 risk point for each trip with negative profit', () => {
+      const history = [{ profit: 1 }, { profit: -1 }, { profit: -2 }, { profit: 2 }, { profit: 2 }];
+      const rating = new ExperiencedChinaRating(latamVoyage, history);
+      expect(rating.captainHistoryRisk).toEqual(3);
+    });
+
+    it('should remove 2 risk points if captain has been to China and voyage zone is China', () => {
+      const history = [{ zone: 'china' }];
+      const rating = new ExperiencedChinaRating(chinaVoyage, history);
+      expect(rating.captainHistoryRisk).toEqual(3);
+    });
+
+    it('should return zero if captain history risk is negative', () => {
+      const history = [
+        { zone: 'china', profit: 1 },
+        { profit: 2 },
+        { profit: 2 },
+        { profit: 2 },
+        { profit: 2 },
+      ];
+
+      const rating = new ExperiencedChinaRating(chinaVoyage, history);
+      expect(rating.captainHistoryRisk).toEqual(0);
+    });
+  });
+
+  describe('voyageProfitFactor', () => {
+    const captainTripsHistory = [chinaVoyage];
+
+    describe('since voyage is always to China', () => {
+      it('should add 1 point to profit factor', () => {
+        const rating = new ExperiencedChinaRating(chinaVoyage, emptyHistory);
+        expect(rating.voyageProfitFactor).toEqual(3);
+      });
+    });
+
+    describe('captain has experience with voyages to China', () => {
+      it('should add 3 points to the profit factor', () => {
+        const rating = new ExperiencedChinaRating(chinaVoyage, captainTripsHistory);
+        expect(rating.voyageProfitFactor).toEqual(6);
+      });
+
+      it('should add 1 more point if the captain has more than 10 trips in their history', () => {
+        const history = createHistory({ length: 11, zone: 'china' });
+        const rating = new ExperiencedChinaRating(chinaVoyage, history);
+        expect(rating.voyageProfitFactor).toEqual(7);
+      });
+
+      describe('voyage is long', () => {
+        const history = createHistory({ length: 1, zone: 'china' });
+
+        it('should add 1 more point if the voyage has a length greater than 12', () => {
+          const longChinaVoyage = { ...chinaVoyage, length: 13 };
+          const rating = new ExperiencedChinaRating(longChinaVoyage, history);
+          expect(rating.voyageProfitFactor).toEqual(7);
+        });
+
+        it('should remove 1 point if the voyage has a length greater than 18', () => {
+          const longChinaVoyage = { ...chinaVoyage, length: 19 };
+          const rating = new ExperiencedChinaRating(longChinaVoyage, history);
+          expect(rating.voyageProfitFactor).toEqual(6);
+        });
+      });
+    });
+  });
+});
```

Now, similar to the previous example, we need a `createRating` factory function:

```diff
@@ -49,3 +49,9 @@ export class Rating {
 }
 export class ExperiencedChinaRating extends Rating {}
+
+export function createRating(voyage, history) {
+  if (voyage.zone === 'china' && history.some(v => 'china' === v.zone)) {
+    return new ExperiencedChinaRating(voyage, history);
+  } else return new Rating(voyage, history);
+}

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
@@ -1,4 +1,4 @@
-import { Rating, ExperiencedChinaRating } from '.';
+import { Rating, ExperiencedChinaRating, createRating } from '.';
 const createHistory = ({ length, zone }) => Array.from({ length }, () => ({ zone }));
@@ -281,3 +281,19 @@ describe('ExperiencedChinaRating', () => {
     });
   });
 });
+
+describe('createRating', () => {
+  it('should return an ExperiencedChinaRating instance if voyage zone is china and history has a trip to China', () => {
+    const voyage = { zone: 'china' };
+    const history = [{ zone: 'china' }];
+    const rating = createRating(voyage, history);
+    expect(rating instanceof ExperiencedChinaRating).toBeTruthy();
+  });
+
+  it('should return a Rating instance if voyage zone is not china or history has no trip to China', () => {
+    const voyage = { zone: 'latam' };
+    const history = [{ zone: 'latam' }];
+    const rating = createRating(voyage, history);
+    expect(rating instanceof Rating).toBeTruthy();
+  });
+});
```

We are now ready to delegate to `Rating.value` at `rating`:

```diff
@@ -1,9 +1,7 @@
+import { createRating } from './rating';
+
 export function rating(voyage, history) {
-  const vpf = voyageProfitFactor(voyage, history);
-  const vr = voyageRisk(voyage);
-  const chr = captainHistoryRisk(voyage, history);
-  if (vpf * 3 > vr + chr * 2) return 'A';
-  else return 'B';
+  return createRating(voyage, history).value;
 }
 export function voyageRisk(voyage) {
```

We can now start to move China-specific behavior of `captainHistoryRisk` to `ExperiencedChinaRating`, and here's where the tests start to take a big, but expected, hit, since some rules that were tested as part of the base class are being ported to the subclass:

```diff
@@ -23,7 +23,6 @@ export class Rating {
     let result = 1;
     if (this.history.length < 5) result += 4;
     result += this.history.filter(v => v.profit < 0).length;
-    if (this.voyage.zone === 'china' && this.hasChinaHistory) result -= 2;
     return Math.max(result, 0);
   }
@@ -48,7 +47,12 @@ export class Rating {
   }
 }
-export class ExperiencedChinaRating extends Rating {}
+export class ExperiencedChinaRating extends Rating {
+  get captainHistoryRisk() {
+    const result = super.captainHistoryRisk - 2;
+    return Math.max(result, 0);
+  }
+}
 export function createRating(voyage, history) {
   if (voyage.zone === 'china' && history.some(v => 'china' === v.zone)) {

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
@@ -71,25 +71,6 @@ describe('Rating', () => {
       const rating = new Rating(latamVoyage, history);
       expect(rating.captainHistoryRisk).toEqual(3);
     });
-
-    it('should remove 2 risk points if captain has been to China and voyage zone is China', () => {
-      const history = [{ zone: 'china' }];
-      const rating = new Rating(chinaVoyage, history);
-      expect(rating.captainHistoryRisk).toEqual(3);
-    });
-
-    it('should return zero if captain history risk is negative', () => {
-      const history = [
-        { zone: 'china', profit: 1 },
-        { profit: 2 },
-        { profit: 2 },
-        { profit: 2 },
-        { profit: 2 },
-      ];
-
-      const rating = new Rating(chinaVoyage, history);
-      expect(rating.captainHistoryRisk).toEqual(0);
-    });
   });
   describe('voyageProfitFactor', () => {
@@ -203,42 +184,31 @@ describe('ExperiencedChinaRating', () => {
   });
   describe('captainHistoryRisk', () => {
-    it('should return 1 as base value of captain history risk', () => {
-      const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
-      const rating = new ExperiencedChinaRating(latamVoyage, fiveTripHistory);
-      expect(rating.captainHistoryRisk).toEqual(1);
-    });
-
     it('should add 4 risk points if history has less than 5 trips', () => {
       const fourTripHistory = createHistory({ length: 4, zone: 'latam' });
       const rating = new ExperiencedChinaRating(latamVoyage, fourTripHistory);
-      expect(rating.captainHistoryRisk).toEqual(5);
+      expect(rating.captainHistoryRisk).toEqual(3);
     });
     it('should add 1 risk point for each trip with negative profit', () => {
       const history = [{ profit: 1 }, { profit: -1 }, { profit: -2 }, { profit: 2 }, { profit: 2 }];
       const rating = new ExperiencedChinaRating(latamVoyage, history);
-      expect(rating.captainHistoryRisk).toEqual(3);
-    });
-
-    it('should remove 2 risk points if captain has been to China and voyage zone is China', () => {
-      const history = [{ zone: 'china' }];
-      const rating = new ExperiencedChinaRating(chinaVoyage, history);
-      expect(rating.captainHistoryRisk).toEqual(3);
+      expect(rating.captainHistoryRisk).toEqual(1);
     });
     it('should return zero if captain history risk is negative', () => {
-      const history = [
-        { zone: 'china', profit: 1 },
-        { profit: 2 },
-        { profit: 2 },
-        { profit: 2 },
-        { profit: 2 },
-      ];
-
-      const rating = new ExperiencedChinaRating(chinaVoyage, history);
+      const fiveTripHistory = createHistory({ length: 5, zone: 'latam' });
+      const rating = new ExperiencedChinaRating(latamVoyage, fiveTripHistory);
       expect(rating.captainHistoryRisk).toEqual(0);
     });
+
+    describe('since voyage is always to China', () => {
+      it('should remove 2 risk points from history risk', () => {
+        const history = [{ zone: 'china' }];
+        const rating = new ExperiencedChinaRating(chinaVoyage, history);
+        expect(rating.captainHistoryRisk).toEqual(3);
+      });
+    });
   });
   describe('voyageProfitFactor', () => {
```

Now, on to isolating the voyage and history length factor, we introduce a getter:

```diff
@@ -30,6 +30,12 @@ export class Rating {
     let result = 2;
     if (this.voyage.zone === 'china') result += 1;
     if (this.voyage.zone === 'east-indies') result += 1;
+    result += this.voyageAndHistoryLengthFactor;
+    return result;
+  }
+
+  get voyageAndHistoryLengthFactor() {
+    let result = 0;
     if (this.voyage.zone === 'china' && this.hasChinaHistory) {
       result += 3;
       if (this.history.length > 10) result += 1;

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
@@ -155,6 +155,51 @@ describe('Rating', () => {
       expect(rating.hasChinaHistory).toBeFalsy();
     });
   });
+
+  describe('voyageAndHistoryLengthFactor', () => {
+    it('should return 0 as base value of profit factor', () => {
+      const rating = new Rating(latamVoyage, emptyHistory);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(0);
+    });
+
+    it('should add 3 points to profit factor if voyage zone is china and history has a trip to China', () => {
+      const history = [{ zone: 'china' }];
+      const rating = new Rating(chinaVoyage, history);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(3);
+    });
+
+    it('should add 1 point if history has more than 10 trips', () => {
+      const history = createHistory({ length: 11, zone: 'china' });
+      const rating = new Rating(chinaVoyage, history);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
+    });
+
+    it('should add 1 point if voyage length is greater than 12', () => {
+      const longChinaVoyage = { ...chinaVoyage, length: 13 };
+      const history = Array.from({ length: 5 }, () => chinaVoyage);
+      const rating = new Rating(longChinaVoyage, history);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
+    });
+
+    it('should remove 1 point if voyage length is greater than 18', () => {
+      const extraLongChinaVoyage = { ...chinaVoyage, length: 13 };
+      const history = Array.from({ length: 5 }, () => chinaVoyage);
+      const rating = new Rating(extraLongChinaVoyage, history);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
+    });
+
+    it('should add 1 point if history has more than 8 trips', () => {
+      const history = Array.from({ length: 9 }, () => latamVoyage);
+      const rating = new Rating(latamVoyage, history);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(1);
+    });
+
+    it('should remove 1 point if voyage length is greater than 14', () => {
+      const voyage = { zone: 'latam', length: 15 };
+      const rating = new Rating(voyage, emptyHistory);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(-1);
+    });
+  });
 });
 describe('ExperiencedChinaRating', () => {
```

And now we can implement a variation of `voyageAndHistoryLengthFactor` at `ExperiencedChinaRating`:

```diff
@@ -36,15 +36,8 @@ export class Rating {
   get voyageAndHistoryLengthFactor() {
     let result = 0;
-    if (this.voyage.zone === 'china' && this.hasChinaHistory) {
-      result += 3;
-      if (this.history.length > 10) result += 1;
-      if (this.voyage.length > 12) result += 1;
-      if (this.voyage.length > 18) result -= 1;
-    } else {
-      if (this.history.length > 8) result += 1;
-      if (this.voyage.length > 14) result -= 1;
-    }
+    if (this.history.length > 8) result += 1;
+    if (this.voyage.length > 14) result -= 1;
     return result;
   }
@@ -58,6 +51,15 @@ export class ExperiencedChinaRating extends Rating {
     const result = super.captainHistoryRisk - 2;
     return Math.max(result, 0);
   }
+
+  get voyageAndHistoryLengthFactor() {
+    let result = 0;
+    result += 3;
+    if (this.history.length > 10) result += 1;
+    if (this.voyage.length > 12) result += 1;
+    if (this.voyage.length > 18) result -= 1;
+    return result;
+  }
 }
 export function createRating(voyage, history) {

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
@@ -1,6 +1,7 @@
 import { Rating, ExperiencedChinaRating, createRating } from '.';
-const createHistory = ({ length, zone }) => Array.from({ length }, () => ({ zone }));
+const createHistory = ({ length, zone, profit = 0 }) =>
+  Array.from({ length }, () => ({ zone, profit }));
 const emptyHistory = createHistory({ length: 0 });
 const latamVoyage = { zone: 'latam' };
@@ -79,61 +80,26 @@ describe('Rating', () => {
       expect(rating.voyageProfitFactor).toEqual(2);
     });
+    it('should add 1 point to profit factor if voyage zone is china', () => {
+      const rating = new Rating(chinaVoyage, emptyHistory);
+      expect(rating.voyageProfitFactor).toEqual(3);
+    });
+
     it('should add 1 point to profit factor if voyage zone is east-indies', () => {
       const rating = new Rating(eastIndiesVoyage, emptyHistory);
       expect(rating.voyageProfitFactor).toEqual(3);
     });
-    describe('voyage is to China', () => {
-      const captainTripsHistory = [chinaVoyage];
-
-      it('should add 1 point to profit factor', () => {
-        const rating = new Rating(chinaVoyage, emptyHistory);
-        expect(rating.voyageProfitFactor).toEqual(3);
-      });
-
-      describe('captain has experience with voyages to China', () => {
-        it('should add 3 points to the profit factor', () => {
-          const rating = new Rating(chinaVoyage, captainTripsHistory);
-          expect(rating.voyageProfitFactor).toEqual(6);
-        });
-
-        it('should add 1 more point if the captain has more than 10 trips in their history', () => {
-          const history = createHistory({ length: 11, zone: 'china' });
-          const rating = new Rating(chinaVoyage, history);
-          expect(rating.voyageProfitFactor).toEqual(7);
-        });
-
-        describe('voyage is long', () => {
-          const history = createHistory({ length: 1, zone: 'china' });
-
-          it('should add 1 more point if the voyage has a length greater than 12', () => {
-            const longChinaVoyage = { ...chinaVoyage, length: 13 };
-            const rating = new Rating(longChinaVoyage, history);
-            expect(rating.voyageProfitFactor).toEqual(7);
-          });
-
-          it('should remove 1 point if the voyage has a length greater than 18', () => {
-            const longChinaVoyage = { ...chinaVoyage, length: 19 };
-            const rating = new Rating(longChinaVoyage, history);
-            expect(rating.voyageProfitFactor).toEqual(6);
-          });
-        });
-      });
+    it('should add 1 point if history has more than 8 trips', () => {
+      const history = Array.from({ length: 9 }, () => latamVoyage);
+      const rating = new Rating(latamVoyage, history);
+      expect(rating.voyageProfitFactor).toEqual(3);
     });
-    describe('voyage is not to China', () => {
-      it('should add 1 point if history has more than 8 trips', () => {
-        const history = Array.from({ length: 9 }, () => latamVoyage);
-        const rating = new Rating(latamVoyage, history);
-        expect(rating.voyageProfitFactor).toEqual(3);
-      });
-
-      it('should remove 1 point if voyage length is more than 14', () => {
-        const voyage = { zone: 'latam', length: 15 };
-        const rating = new Rating(voyage, emptyHistory);
-        expect(rating.voyageProfitFactor).toEqual(1);
-      });
+    it('should remove 1 point if voyage length is more than 14', () => {
+      const voyage = { zone: 'latam', length: 15 };
+      const rating = new Rating(voyage, emptyHistory);
+      expect(rating.voyageProfitFactor).toEqual(1);
     });
   });
@@ -162,32 +128,6 @@ describe('Rating', () => {
       expect(rating.voyageAndHistoryLengthFactor).toEqual(0);
     });
-    it('should add 3 points to profit factor if voyage zone is china and history has a trip to China', () => {
-      const history = [{ zone: 'china' }];
-      const rating = new Rating(chinaVoyage, history);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(3);
-    });
-
-    it('should add 1 point if history has more than 10 trips', () => {
-      const history = createHistory({ length: 11, zone: 'china' });
-      const rating = new Rating(chinaVoyage, history);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
-    });
-
-    it('should add 1 point if voyage length is greater than 12', () => {
-      const longChinaVoyage = { ...chinaVoyage, length: 13 };
-      const history = Array.from({ length: 5 }, () => chinaVoyage);
-      const rating = new Rating(longChinaVoyage, history);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
-    });
-
-    it('should remove 1 point if voyage length is greater than 18', () => {
-      const extraLongChinaVoyage = { ...chinaVoyage, length: 13 };
-      const history = Array.from({ length: 5 }, () => chinaVoyage);
-      const rating = new Rating(extraLongChinaVoyage, history);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
-    });
-
     it('should add 1 point if history has more than 8 trips', () => {
       const history = Array.from({ length: 9 }, () => latamVoyage);
       const rating = new Rating(latamVoyage, history);
@@ -212,9 +152,8 @@ describe('ExperiencedChinaRating', () => {
     });
     it('should return "B" if voyage profit factor is not 3 times greater than voyage risk plus captain history risk times 2', () => {
-      const voyage = { zone: 'china' };
-      const history = createHistory({ length: 1, zone: 'China' });
-      const rating = new ExperiencedChinaRating(voyage, history);
+      const history = createHistory({ length: 20, zone: 'China', profit: -1 });
+      const rating = new ExperiencedChinaRating(chinaVoyage, history);
       expect(rating.value).toEqual('B');
     });
   });
@@ -259,13 +198,6 @@ describe('ExperiencedChinaRating', () => {
   describe('voyageProfitFactor', () => {
     const captainTripsHistory = [chinaVoyage];
-    describe('since voyage is always to China', () => {
-      it('should add 1 point to profit factor', () => {
-        const rating = new ExperiencedChinaRating(chinaVoyage, emptyHistory);
-        expect(rating.voyageProfitFactor).toEqual(3);
-      });
-    });
-
     describe('captain has experience with voyages to China', () => {
       it('should add 3 points to the profit factor', () => {
         const rating = new ExperiencedChinaRating(chinaVoyage, captainTripsHistory);
@@ -295,6 +227,33 @@ describe('ExperiencedChinaRating', () => {
       });
     });
   });
+
+  describe('voyageAndHistoryLengthFactor', () => {
+    it('should return 3 as base value of profit factor', () => {
+      const rating = new ExperiencedChinaRating(latamVoyage, emptyHistory);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(3);
+    });
+
+    it('should add 1 point if history has more than 10 trips', () => {
+      const history = createHistory({ length: 11, zone: 'china' });
+      const rating = new ExperiencedChinaRating(chinaVoyage, history);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
+    });
+
+    it('should add 1 point if voyage length is greater than 12', () => {
+      const longChinaVoyage = { ...chinaVoyage, length: 13 };
+      const history = Array.from({ length: 5 }, () => chinaVoyage);
+      const rating = new ExperiencedChinaRating(longChinaVoyage, history);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
+    });
+
+    it('should remove 1 point if voyage length is greater than 18', () => {
+      const extraLongChinaVoyage = { ...chinaVoyage, length: 19 };
+      const history = Array.from({ length: 5 }, () => chinaVoyage);
+      const rating = new ExperiencedChinaRating(extraLongChinaVoyage, history);
+      expect(rating.voyageAndHistoryLengthFactor).toEqual(3);
+    });
+  });
 });
 describe('createRating', () => {
```

Now, as a final touch, we can separate "history length" and "voyage length" into two different getters. We start by extracting `historyLengthFactor` out of `Rating.voyageAndHistoryLengthFactor`:

```diff
@@ -36,11 +36,15 @@ export class Rating {
   get voyageAndHistoryLengthFactor() {
     let result = 0;
-    if (this.history.length > 8) result += 1;
+    result += this.historyLengthFactor;
     if (this.voyage.length > 14) result -= 1;
     return result;
   }
+  get historyLengthFactor() {
+    return this.history.length > 8 ? 1 : 0;
+  }
+
   get hasChinaHistory() {
     return this.history.some(v => 'china' === v.zone);
   }

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
@@ -140,6 +140,20 @@ describe('Rating', () => {
       expect(rating.voyageAndHistoryLengthFactor).toEqual(-1);
     });
   });
+
+  describe('historyLengthFactor', () => {
+    it('should return 0 if history length is less than 8', () => {
+      const history = Array.from({ length: 7 }, () => latamVoyage);
+      const rating = new Rating(latamVoyage, history);
+      expect(rating.historyLengthFactor).toEqual(0);
+    });
+
+    it('should return 1 if history length is more than 8', () => {
+      const history = Array.from({ length: 9 }, () => latamVoyage);
+      const rating = new Rating(latamVoyage, history);
+      expect(rating.historyLengthFactor).toEqual(1);
+    });
+  });
 });
 describe('ExperiencedChinaRating', () => {
```

The same goes for the subclass:

```diff
@@ -59,11 +59,15 @@ export class ExperiencedChinaRating extends Rating {
   get voyageAndHistoryLengthFactor() {
     let result = 0;
     result += 3;
-    if (this.history.length > 10) result += 1;
+    result += this.historyLengthFactor;
     if (this.voyage.length > 12) result += 1;
     if (this.voyage.length > 18) result -= 1;
     return result;
   }
+
+  get historyLengthFactor() {
+    return this.history.length > 10 ? 1 : 0;
+  }
 }
 export function createRating(voyage, history) {

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
@@ -268,6 +268,20 @@ describe('ExperiencedChinaRating', () => {
       expect(rating.voyageAndHistoryLengthFactor).toEqual(3);
     });
   });
+
+  describe('historyLengthFactor', () => {
+    it('should return 0 if history length is less than 10', () => {
+      const history = Array.from({ length: 9 }, () => latamVoyage);
+      const rating = new ExperiencedChinaRating(latamVoyage, history);
+      expect(rating.historyLengthFactor).toEqual(0);
+    });
+
+    it('should return 1 if history length is more than 10', () => {
+      const history = Array.from({ length: 11 }, () => latamVoyage);
+      const rating = new ExperiencedChinaRating(latamVoyage, history);
+      expect(rating.historyLengthFactor).toEqual(1);
+    });
+  });
 });
 describe('createRating', () => {
```

Now, we can move the call to `historyLengthFactor` to the `Rating` superclass:

```diff
@@ -30,13 +30,13 @@ export class Rating {
     let result = 2;
     if (this.voyage.zone === 'china') result += 1;
     if (this.voyage.zone === 'east-indies') result += 1;
+    result += this.historyLengthFactor;
     result += this.voyageAndHistoryLengthFactor;
     return result;
   }
   get voyageAndHistoryLengthFactor() {
     let result = 0;
-    result += this.historyLengthFactor;
     if (this.voyage.length > 14) result -= 1;
     return result;
   }
@@ -59,7 +59,6 @@ export class ExperiencedChinaRating extends Rating {
   get voyageAndHistoryLengthFactor() {
     let result = 0;
     result += 3;
-    result += this.historyLengthFactor;
     if (this.voyage.length > 12) result += 1;
     if (this.voyage.length > 18) result -= 1;
     return result;

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
@@ -128,12 +128,6 @@ describe('Rating', () => {
       expect(rating.voyageAndHistoryLengthFactor).toEqual(0);
     });
-    it('should add 1 point if history has more than 8 trips', () => {
-      const history = Array.from({ length: 9 }, () => latamVoyage);
-      const rating = new Rating(latamVoyage, history);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(1);
-    });
-
     it('should remove 1 point if voyage length is greater than 14', () => {
       const voyage = { zone: 'latam', length: 15 };
       const rating = new Rating(voyage, emptyHistory);
@@ -248,12 +242,6 @@ describe('ExperiencedChinaRating', () => {
       expect(rating.voyageAndHistoryLengthFactor).toEqual(3);
     });
-    it('should add 1 point if history has more than 10 trips', () => {
-      const history = createHistory({ length: 11, zone: 'china' });
-      const rating = new ExperiencedChinaRating(chinaVoyage, history);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
-    });
-
     it('should add 1 point if voyage length is greater than 12', () => {
       const longChinaVoyage = { ...chinaVoyage, length: 13 };
       const history = Array.from({ length: 5 }, () => chinaVoyage);
```

Finally, we can rename `voyageAndHistoryLengthFactor` to `voyageLengthFactor`:

```diff
@@ -31,11 +31,11 @@ export class Rating {
     if (this.voyage.zone === 'china') result += 1;
     if (this.voyage.zone === 'east-indies') result += 1;
     result += this.historyLengthFactor;
-    result += this.voyageAndHistoryLengthFactor;
+    result += this.voyageLengthFactor;
     return result;
   }
-  get voyageAndHistoryLengthFactor() {
+  get voyageLengthFactor() {
     let result = 0;
     if (this.voyage.length > 14) result -= 1;
     return result;
@@ -56,7 +56,7 @@ export class ExperiencedChinaRating extends Rating {
     return Math.max(result, 0);
   }
-  get voyageAndHistoryLengthFactor() {
+  get voyageLengthFactor() {
     let result = 0;
     result += 3;
     if (this.voyage.length > 12) result += 1;

diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
@@ -122,16 +122,16 @@ describe('Rating', () => {
     });
   });
-  describe('voyageAndHistoryLengthFactor', () => {
+  describe('voyageLengthFactor', () => {
     it('should return 0 as base value of profit factor', () => {
       const rating = new Rating(latamVoyage, emptyHistory);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(0);
+      expect(rating.voyageLengthFactor).toEqual(0);
     });
     it('should remove 1 point if voyage length is greater than 14', () => {
       const voyage = { zone: 'latam', length: 15 };
       const rating = new Rating(voyage, emptyHistory);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(-1);
+      expect(rating.voyageLengthFactor).toEqual(-1);
     });
   });
@@ -236,24 +236,24 @@ describe('ExperiencedChinaRating', () => {
     });
   });
-  describe('voyageAndHistoryLengthFactor', () => {
+  describe('voyageLengthFactor', () => {
     it('should return 3 as base value of profit factor', () => {
       const rating = new ExperiencedChinaRating(latamVoyage, emptyHistory);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(3);
+      expect(rating.voyageLengthFactor).toEqual(3);
     });
     it('should add 1 point if voyage length is greater than 12', () => {
       const longChinaVoyage = { ...chinaVoyage, length: 13 };
       const history = Array.from({ length: 5 }, () => chinaVoyage);
       const rating = new ExperiencedChinaRating(longChinaVoyage, history);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(4);
+      expect(rating.voyageLengthFactor).toEqual(4);
     });
     it('should remove 1 point if voyage length is greater than 18', () => {
       const extraLongChinaVoyage = { ...chinaVoyage, length: 19 };
       const history = Array.from({ length: 5 }, () => chinaVoyage);
       const rating = new ExperiencedChinaRating(extraLongChinaVoyage, history);
-      expect(rating.voyageAndHistoryLengthFactor).toEqual(3);
+      expect(rating.voyageLengthFactor).toEqual(3);
     });
   });
```

And simplify `Rating.voyageLengthFactor` by using a ternary:

```diff
@@ -36,9 +36,7 @@ export class Rating {
   }
   get voyageLengthFactor() {
-    let result = 0;
-    if (this.voyage.length > 14) result -= 1;
-    return result;
+    return this.voyage.length > 14 ? -1 : 0;
   }
   get historyLengthFactor() {
```

Finally, we can move the 3 risk points out of `voyageLengthFactor` and into `voyageProfitFactor` at `ExperiencedChinaRating`:

```diff
@@ -56,7 +56,6 @@ export class ExperiencedChinaRating extends Rating {
   get voyageLengthFactor() {
     let result = 0;
-    result += 3;
     if (this.voyage.length > 12) result += 1;
     if (this.voyage.length > 18) result -= 1;
     return result;
@@ -65,6 +64,10 @@ export class ExperiencedChinaRating extends Rating {
   get historyLengthFactor() {
     return this.history.length > 10 ? 1 : 0;
   }
+
+  get voyageProfitFactor() {
+    return super.voyageProfitFactor + 3;
+  }
 }
 export function createRating(voyage, history) {
diff --git a/src/using-polymorphism-for-variation/rating/index.test.js b/src/using-polymorphism-for-variation/rating/index.test.js
index 52426c7..6bc25a2 100644
@@ -237,23 +237,23 @@ describe('ExperiencedChinaRating', () => {
   });
   describe('voyageLengthFactor', () => {
-    it('should return 3 as base value of profit factor', () => {
+    it('should return 0 as base value of profit factor', () => {
       const rating = new ExperiencedChinaRating(latamVoyage, emptyHistory);
-      expect(rating.voyageLengthFactor).toEqual(3);
+      expect(rating.voyageLengthFactor).toEqual(0);
     });
     it('should add 1 point if voyage length is greater than 12', () => {
       const longChinaVoyage = { ...chinaVoyage, length: 13 };
       const history = Array.from({ length: 5 }, () => chinaVoyage);
       const rating = new ExperiencedChinaRating(longChinaVoyage, history);
-      expect(rating.voyageLengthFactor).toEqual(4);
+      expect(rating.voyageLengthFactor).toEqual(1);
     });
     it('should remove 1 point if voyage length is greater than 18', () => {
       const extraLongChinaVoyage = { ...chinaVoyage, length: 19 };
       const history = Array.from({ length: 5 }, () => chinaVoyage);
       const rating = new ExperiencedChinaRating(extraLongChinaVoyage, history);
-      expect(rating.voyageLengthFactor).toEqual(3);
+      expect(rating.voyageLengthFactor).toEqual(0);
     });
   });
```

And that's it! All China-specific and history-and-voyage-specific code is isolated in its specialized subclass.

#### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                                   | Message                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [dd20c53](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/dd20c5332f1eb70208f940db180106cc5580d8c9) | introduce `Rating` class                                                                           |
| [2e83eae](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/2e83eae7626bb180e1d3eb1a1dbe494dce123dcc) | introduce `ExperiencedChinaRating` class                                                           |
| [e8647cc](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/e8647cc61d8da79c743db179214ddd513418abeb) | introduce `createRating` factory function                                                          |
| [fee7f65](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/fee7f658e7ac59a097e6c04e9bc892c21b1fe071) | delegate to `Rating.value` at `rating`                                                             |
| [7538544](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/7538544b94e1227cd6793535a22a8832233e13c8) | move china-history specific behavior of `captainHistoryRisk` to `ExperiencedChinaRating`           |
| [68d283e](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/68d283e01fb1261bdf5e7cb3f22b41028e18c54e) | extract voyage and history length factors into a getter                                            |
| [b523010](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/b5230101d5a548541072c56a09367e7498921e45) | move china-specific logic of `voyageAndHistoryLengthFactor` to `ExperiencedChinaRating`            |
| [c7f0d12](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/c7f0d12ba7fee185fb6ef2b73eda2780092babf3) | extract `historyLengthFactor` out of `Rating.voyageAndHistoryLengthFactor`                         |
| [cc25aa5](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/cc25aa5a6c525a3313babac995e74a46f12ff793) | extract `historyLengthFactor` out of `ExperiencedChinaRating.voyageAndHistoryLengthFactor`         |
| [e941856](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/e94185635fb2e24f073ec626fe5c38528ecb9b92) | move call to `historyLengthFactor` to `Rating` superclass                                          |
| [f69c068](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/f69c068d57b9c9b7268cb5c4c97ad4681769567a) | rename `voyageAndHistoryLengthFactor` to `voyageLengthFactor`                                      |
| [25bfc75](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/25bfc7538e926f407ce2cf97d177f6a97f579b31) | simplify `Rating.voyageLengthFactor`                                                               |
| [db71be6](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commit/db71be639054b73d0a8fb27f7e23726aaaaedb41) | move 3 profit points from `voyageLengthFactor` to `voyageProfitFactor` at `ExperiencedChinaRating` |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/replace-conditional-with-polymorphism-refactoring/commits/main).
