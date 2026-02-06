# NG Dynamic Forms Core

## Recent commits

- chore: update package version to 21.1.5
- fix: Allow RegExp input into the regular expression literal parser.
- fix: Correct control type in function calls in the cleanup matcher
- chore: update package version and Angular dependencies to 21.1.3
- chore: update Angular dependencies to version 21.1.3
- feat: Add support for regular expressions in the matching conditions. Add aux function tryParseRegExpLiteral
- feat: Add new dynamic Matchers: ALL_REQUIRED, DISABLED_AND_HIDDEN and CLEAN_VALUE

## Installation
```
npm i @soulonfire/ng-dynamic-forms-core -S
```

## Import
```
@NgModule({

    imports: [
        ReactiveFormsModule,
        DynamicFormsCoreModule
    ]
})

export class AppModule {}
```

## Resources

* [**API Documentation**](http://ng2-dynamic-forms.udos86.de/docs/core/) 
