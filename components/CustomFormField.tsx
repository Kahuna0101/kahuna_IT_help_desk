import React, {  useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Control } from "react-hook-form";
import Image from "next/image";

import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/core'
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from "./ui/textarea";
import { useTheme } from "next-themes";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  PASSWORD = "password",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  fieldType: FormFieldType;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
}

const RenderField = ({ field, props }: { field:any, props:CustomProps}) => {
  const { fieldType, placeholder, showTimeSelect, dateFormat, label, disabled, renderSkeleton } = props;
  const { theme } = useTheme();

  switch (fieldType) {
    case FormFieldType.PASSWORD:
      const [showPassword, setShowPassword] = useState(true);

      const togglePassword = () => {
        setShowPassword(!showPassword);
      };

      return (
        <FormControl>
            <div className="flex flex-row items-center relative">
              <Input
                placeholder={placeholder}
                {...field}
                type={showPassword? 'text': 'password'}
                className="shad-input border-2 w-full"
              />
              
                  <Image
                  src={showPassword ? "/icons/eye.svg" : "/icons/eye-closed.png"}
                  width={24}
                  height={24}
                  alt="eye"
                  className="absolute right-4 cursor-pointer"
                  onClick={togglePassword}
                />
             
            </div>
          </FormControl>
      )  
    case FormFieldType.INPUT:
      return (
        <FormControl>
        <Input
          placeholder={placeholder}
          {...field}
          className="shad-input border-2"
        />
        </FormControl>
      )
    case FormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textArea"
            disabled={props.disabled}
          />
        </FormControl>
      )
    case FormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput 
            defaultCountry="NG"
            placeholder={placeholder}
            international
            withCountryCallingCode
            value={field.value as E164Number | undefined}
            onChange={field.onChange}
            className="input-phone"
        />
        </FormControl>
      )
    case FormFieldType.CHECKBOX:
      return (
        <FormControl>
        <div className="flex items-center gap-4">
          <Checkbox 
            id={props.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            className="checkbox"
          />
          <label htmlFor={props.name} className="checkbox-label">
            {props.label}
          </label>
        </div>
      </FormControl>
      )
    case FormFieldType.DATE_PICKER:
        return (
          <div className="flex rounded-md border border-[#2746D8] dark:border-dark-500 dark:bg-dark-400">
            <Image 
             src="/icons/calendar.svg"
             width={24}
             height={24}
             alt="calendar"
             className="ml-2"
            />
            <FormControl>
             <DatePicker 
              selected={field.value} 
              onChange={(date) => field.onChange(date)} 
              dateFormat={dateFormat ?? 'MM/dd/yyy'}
              showTimeSelect={showTimeSelect ?? false}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
              className={`${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}
              />
            </FormControl>
          </div>
      )
  case FormFieldType.SELECT:
      return (
        <FormControl>
          <Select 
            onValueChange={field.onChange}
            defaultValue={field.value}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger  className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="shad-select-content">
              {props.children}
            </SelectContent>
          </Select>
        </FormControl>
      )
    case FormFieldType.SKELETON:
        return renderSkeleton ? renderSkeleton(field) : null
    default:
      break;
  }
};


const CustomFormField = (props : CustomProps) => {
  const { control, name, label, fieldType, disabled } = props;
  
  return (
    <FormField
      control={control}
      name={name}
      disabled={disabled}
      render={({ field }) => (
        <FormItem className="w-full">
          {fieldType !== FormFieldType.CHECKBOX && label && (
            <FormLabel className="shad-input-label">{label}</FormLabel>  
          )}
            <RenderField field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
