import {
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { Control, useController, UseControllerProps } from 'react-hook-form'

//

interface Props {
  control: Control<any, object>
  rules?: UseControllerProps['rules']
  name: string
}

export function Input({
  name,
  control,
  rules,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & Props) {
  const { field } = useController({ control, name, rules })

  return (
    <input
      {...props}
      ref={field.ref}
      value={field.value}
      onBlur={field.onBlur}
      onChange={field.onChange}
    />
  )
}

export function Select({
  name,
  control,
  rules,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & Props) {
  const { field } = useController({ control, name, rules })

  return (
    <select
      {...props}
      ref={field.ref}
      value={field.value}
      onBlur={field.onBlur}
      onChange={field.onChange}
    />
  )
}

export function TextArea({
  name,
  control,
  rules,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & Props) {
  const { field } = useController({ control, name, rules })

  return (
    <textarea
      {...props}
      ref={field.ref}
      value={field.value}
      onBlur={field.onBlur}
      onChange={field.onChange}
    />
  )
}
