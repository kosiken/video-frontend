import { TypographyTypeMap } from '@mui/material/Typography';
import Typography   from '@mui/material/Typography';
import React from 'react';
import { OverridableStringUnion } from '@mui/types';

type ControlledTextProps<
D extends React.ElementType = TypographyTypeMap['defaultComponent'],
P = {  length?: number;
    text: string;
    color?: string;
    component?: string; }
> = TypographyTypeMap<P, D>;

const ControlledText: React.FC<TypographyTypeMap<{  length?: number;
    text: string;
    color?: string;
    component?: string; }, TypographyTypeMap['defaultComponent']>> = ({props}) => {
    const {text, length = 10,   ...oProps} = props;
    const getText = () => {
        if(props.text.length > length) return (text.slice(0, length) + "...")
        else return text;
    }
    return (
        <Typography  {...oProps}>
                {getText()}
            </Typography>
    )
}

export default ControlledText
