import { InjectionToken, Injector, ValueProvider } from '@angular/core';
import { FormControl, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DynamicFormControlModel } from '../model/dynamic-form-control.model';
import { DynamicFormValidationService } from './dynamic-form-validation.service';
import { isObject } from '../utils/core.utils';
import { DynamicValidatorsConfig } from '../model/misc/dynamic-form-control-validation.model';
import { DynamicFormService } from './dynamic-form.service';
import { DynamicCheckboxGroupModel, DynamicFormArrayGroupModel, DynamicFormGroupModel, DynamicFormModel, DynamicFormValueControlModel } from '../core';

export const MATCH_DISABLED = 'DISABLED';
export const MATCH_ENABLED = 'ENABLED';
export const MATCH_HIDDEN = 'HIDDEN';
export const MATCH_OPTIONAL = 'OPTIONAL';
export const MATCH_REQUIRED = 'REQUIRED';
export const MATCH_VISIBLE = 'VISIBLE';
export const MATCH_ALL_REQUIRED = 'ALL_REQUIRED';
export const MATCH_NONE_REQUIRED = 'NONE_REQUIRED';
export const MATCH_DISABLED_AND_HIDDEN = 'DISABLED_AND_HIDDEN';
export const MATCH_ENABLE_AND_VISIBLE = 'ENABLE_AND_VISIBLE';
export const MATCH_CLEAN_VALUE = 'CLEAN_VALUE';
export const MATCH_DONT_CLEAN_VALUE = 'DONT_CLEAN_VALUE';

export const AND_OPERATOR = 'AND';
export const OR_OPERATOR = 'OR';

export interface DynamicFormControlMatcher {
    match: string;
    opposingMatch: string | null;

    onChange(hasMatch: boolean, model: DynamicFormControlModel, control: UntypedFormControl, injector: Injector): void;
}

export const DYNAMIC_MATCHERS = new InjectionToken<DynamicFormControlMatcher>('DYNAMIC_MATCHERS');

export const DISABLED_MATCHER: DynamicFormControlMatcher = {
    match: MATCH_DISABLED,
    opposingMatch: MATCH_ENABLED,
    onChange(hasMatch, model) {
        model.disabled = hasMatch;
    }
};

export const HIDDEN_MATCHER: DynamicFormControlMatcher = {
    match: MATCH_HIDDEN,
    opposingMatch: MATCH_VISIBLE,
    onChange(hasMatch, model) {
        model.hidden = hasMatch;
    }
};

export const REQUIRED_MATCHER: DynamicFormControlMatcher = {
    match: MATCH_REQUIRED,
    opposingMatch: MATCH_OPTIONAL,
    onChange(hasMatch, model, control, injector) {
        let validatorsConfig = null;

        if (hasMatch) {
            validatorsConfig = isObject(model.validators) ? {...model.validators, required: null} : {required: null};

        } else {
            if (isObject(model.validators)) {
                delete (model.validators as Pick<DynamicValidatorsConfig, 'required'>).required;
                validatorsConfig = {...model.validators};
            }
        }

        injector.get(DynamicFormValidationService).updateValidators(validatorsConfig, control, model);
        injector.get(DynamicFormService).detectChanges();
    }
};

export const ALL_REQUIRED_MATCHER: DynamicFormControlMatcher = {
    match: MATCH_ALL_REQUIRED,
    opposingMatch: MATCH_NONE_REQUIRED,
  onChange(hasMatch: boolean, model: DynamicFormControlModel, control: FormControl, injector: Injector): void {
    const requireGroup = (group: DynamicFormModel, required: boolean, controls: { [key: string]: UntypedFormControl }) => {
      group
        .filter((innerModel) => !innerModel.hidden)
        .forEach((innerModel: DynamicFormControlModel) => {
          let innerControl = controls[innerModel.id];
          if (innerModel instanceof DynamicFormValueControlModel) {
            REQUIRED_MATCHER.onChange(hasMatch, innerModel, innerControl, injector);
          } else if (
            innerModel instanceof DynamicFormGroupModel ||
            innerModel instanceof DynamicCheckboxGroupModel ||
            innerModel instanceof DynamicFormArrayGroupModel
          ) {
            requireGroup(innerModel.group, required, (innerControl as any)['controls']);
          }
        });
    };
    if (model instanceof DynamicFormGroupModel && !model.hidden) {
      requireGroup(model.group, hasMatch, (control as any)['controls']);
    } else if (model instanceof DynamicFormValueControlModel && model.required !== hasMatch) {
      REQUIRED_MATCHER.onChange(hasMatch, model, control, injector);
    }
  }
};

export const ENABLE_AND_VISIBLE_MATCHER: DynamicFormControlMatcher = {
  match: MATCH_DISABLED_AND_HIDDEN,
  opposingMatch: MATCH_ENABLE_AND_VISIBLE,
  onChange(hasMatch: boolean, model: DynamicFormControlModel, control: FormControl, injector: Injector): void {
    if (model instanceof DynamicFormValueControlModel) {
      model.value = hasMatch ? undefined : model.value;
    }
    model.disabled = hasMatch;
    model.hidden = hasMatch;
  }
};

export const CLEAN_VALUE_MATCHER: DynamicFormControlMatcher = {
  match: MATCH_CLEAN_VALUE,
  opposingMatch: MATCH_DONT_CLEAN_VALUE,
  onChange(hasMatch: boolean, model: DynamicFormControlModel, control: FormControl): void {
    const cleanGroup = (group: DynamicFormModel, required: boolean, controls: { [key: string]: UntypedFormControl }) => {
      group
        .filter((innerModel) => !innerModel.hidden)
        .forEach((innerModel: DynamicFormControlModel) => {
          let innerControl = controls[innerModel.id];
          if (innerModel instanceof DynamicFormValueControlModel) {
            if (hasMatch) {
              innerControl.reset();
            }
          } else if (
            innerModel instanceof DynamicFormGroupModel ||
            innerModel instanceof DynamicCheckboxGroupModel ||
            innerModel instanceof DynamicFormArrayGroupModel
          ) {
            cleanGroup(innerModel.group, required, innerControl as any['controls']);
          }
        });
    };
    if (model instanceof DynamicFormGroupModel && !model.hidden) {
      cleanGroup(model.group, hasMatch, control as any['controls']);
    } else if (model instanceof DynamicFormValueControlModel && model.required !== hasMatch) {
      if (hasMatch) {
        control.reset();
      }
    }
  }
};

export const DISABLED_MATCHER_PROVIDER: ValueProvider = {
    provide: DYNAMIC_MATCHERS,
    useValue: DISABLED_MATCHER,
    multi: true
};

export const HIDDEN_MATCHER_PROVIDER: ValueProvider = {
    provide: DYNAMIC_MATCHERS,
    useValue: HIDDEN_MATCHER,
    multi: true
};

export const REQUIRED_MATCHER_PROVIDER: ValueProvider = {
    provide: DYNAMIC_MATCHERS,
    useValue: REQUIRED_MATCHER,
    multi: true
};

export const ALL_REQUIRED_MATCHER_PROVIDER: ValueProvider = {
    provide: DYNAMIC_MATCHERS,
    useValue: ALL_REQUIRED_MATCHER,
    multi: true
};

export const ENABLE_AND_VISIBLE_MATCHER_PROVIDER: ValueProvider = {
  provide: DYNAMIC_MATCHERS,
  useValue: ENABLE_AND_VISIBLE_MATCHER,
  multi: true
};

export const CLEAN_VALUE_MATCHER_PROVIDER: ValueProvider = {
  provide: DYNAMIC_MATCHERS,
  useValue: CLEAN_VALUE_MATCHER,
  multi: true
};

export const DYNAMIC_MATCHER_PROVIDERS = [DISABLED_MATCHER_PROVIDER, HIDDEN_MATCHER_PROVIDER, REQUIRED_MATCHER_PROVIDER, ALL_REQUIRED_MATCHER_PROVIDER, ENABLE_AND_VISIBLE_MATCHER_PROVIDER, CLEAN_VALUE_MATCHER_PROVIDER];
