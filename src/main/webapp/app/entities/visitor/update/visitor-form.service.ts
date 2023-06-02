import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVisitor, NewVisitor } from '../visitor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVisitor for edit and NewVisitorFormGroupInput for create.
 */
type VisitorFormGroupInput = IVisitor | PartialWithRequiredKeyOf<NewVisitor>;

type VisitorFormDefaults = Pick<NewVisitor, 'id'>;

type VisitorFormGroupContent = {
  id: FormControl<IVisitor['id'] | NewVisitor['id']>;
  name: FormControl<IVisitor['name']>;
  email: FormControl<IVisitor['email']>;
  phone: FormControl<IVisitor['phone']>;
};

export type VisitorFormGroup = FormGroup<VisitorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VisitorFormService {
  createVisitorFormGroup(visitor: VisitorFormGroupInput = { id: null }): VisitorFormGroup {
    const visitorRawValue = {
      ...this.getFormDefaults(),
      ...visitor,
    };
    return new FormGroup<VisitorFormGroupContent>({
      id: new FormControl(
        { value: visitorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      name: new FormControl(visitorRawValue.name),
      email: new FormControl(visitorRawValue.email),
      phone: new FormControl(visitorRawValue.phone),
    });
  }

  getVisitor(form: VisitorFormGroup): IVisitor | NewVisitor {
    return form.getRawValue() as IVisitor | NewVisitor;
  }

  resetForm(form: VisitorFormGroup, visitor: VisitorFormGroupInput): void {
    const visitorRawValue = { ...this.getFormDefaults(), ...visitor };
    form.reset(
      {
        ...visitorRawValue,
        id: { value: visitorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VisitorFormDefaults {
    return {
      id: null,
    };
  }
}
