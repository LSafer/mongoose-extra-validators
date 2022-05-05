# Mongoose Extra Validators

Extra validators to be used in mongoose

## Setup

To add the plugin you need to do the following:

```typescript
import mongoose from 'mongoose'
import {ExtraValidatorsPlugin} from 'mongoose-extra-validators'

mongoose.plugin(ExtraValidatorsPlugin)
```

## The Validators

This plugin contains multiple common validators.

Each validator must be added specifically for each path.

### Exists Validator

The `exists` validator insures an id field only stores and id that points to an existing document.

You can enable the `exists` validator as follows:

```typescript
import {Schema, SchemaTypes} from 'mongoose'

const schema = new Schmea({
    somethingId: {
        type: SchemaTypes.ObjectId,
        /* type: string | Model | (() => string | Model) */
        ref: 'Something',
        /* type: boolean | (() => boolean) | [boolean | (() => boolean), string] */
        exists: true
    }
})
```

### Singleton validator

The `singleton` validator is like the `unique` option but is a validator.

You can enable the `singleton` validator as follows:

```typescript
import {Schema, SchemaTypes} from 'mongoose'

const schema = new Schmea({
    somethingUnique: {
        type: SchemaTypes.String,
        /* Although redunant, but still good to add it as a second line of defence. */
        unique: true,
        /* type: boolean | (() => boolean) | [boolean | (() => boolean), string] */
        singleton: true
    }
})
```
