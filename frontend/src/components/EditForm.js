import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form"
import { DevTool } from '@hookform/devtools'
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { CustomInput, CustomCheckbox, CustomTableInput, CustomTableForeignKeySelect, CustomTableSelect, CustomSelect } from './FormElements'
import { Grid2 } from '@mui/material';
import Box from '@mui/material/Box';

const Grid = Grid2;

const TableComponent = ({ control, register, errors, name, columns, setValue, itemId }) => {
    const { fields, append, remove } = useFieldArray({
        name,
        control
    });

    const [options, setOptions] = useState({})

    useEffect(() => {
        columns.forEach((column) => {
            if (column.api) {
                fetchOptions(column)
            }
        })
    }, [itemId])

    const fetchOptions = async (column) => {
        const response = await fetch(`/api/${column.api.link}/`);
        const data = await response.json();
        setOptions(prevOptions => ({
            ...prevOptions,
            [column.api.key]: data
        }));
    }

    const renderTableCell = (column, row, rowIndex) => {
        let element;
        switch (column.type) {
            case 'input':
                element = (
                    <CustomTableInput
                        register={register}
                        type={column.inputType}
                        tableName={name}
                        rowIndex={rowIndex}
                        columnName={column.key}
                    />
                );
                break;
            case 'foreignKeySelect':
                element = (
                    <CustomTableForeignKeySelect
                        register={register}
                        errors={errors}
                        tableName={name}
                        rowIndex={rowIndex}
                        columnName={column.key}
                        handleChange={(event) => handleForeignKeyOptionChange(event, rowIndex, column)}
                        options={options?.[column.api.key] ?? []}
                        optionTitle="title"
                    />
                );
                break;
            case 'select':
                element = (
                    <CustomTableSelect
                        register={register}
                        errors={errors}
                        tableName={name}
                        rowIndex={rowIndex}
                        columnName={column.key}
                        options={options?.[column.api.key] ?? []}
                    />
                );
                break;
            default:
                element = null;
        }
        return element;
    };

    const handleForeignKeyOptionChange = (event, rowIndex, column) => {
        const newId = options[column.api.key][event.target.selectedIndex].id;
        console.log(`${name}.${rowIndex}.${column.key}.id`)
        setValue(`${name}.${rowIndex}.${column.key}.id`, newId);
        setValue(`${name}.${rowIndex}.${column.key}_id`, newId);
    };

    const getEmptyRow = () => {
        return columns.reduce((acc, column) => {
            if (column.default) {
                acc[column.key] = column.default;
                if (column.type == 'foreignKeySelect') {
                    acc[`${column.key}_id`] = 0
                }
            }
            return acc;
        }, {});
    }

    return (
        <Grid container spacing={1}>
            <Grid container item direction="row" spacing={1} justifyContent="left" alignItems="left">
                {columns.map((column, colIndex) => (
                    <Grid key={colIndex} item xs={column.width}>
                        {column.header}
                    </Grid>
                ))}
            </Grid>
            {fields.map((row, rowIndex) => (
                <Grid key={row.id} container item direction="row" spacing={1} justifyContent="left" alignItems="left"
                >
                    {columns.map((column, colIndex) => (
                        <Grid key={`${rowIndex}-${colIndex}`} item xs={column.width}>
                            {renderTableCell(column, row, rowIndex)}
                        </Grid>
                    ))}
                    <Grid item xs={1}>
                        <button className="btn btn-danger" onClick={() => remove(rowIndex)}>
                            Delete
                        </button>
                    </Grid>
                </Grid>
            ))}
            <Grid container item direction="row" justifyContent="left" alignItems="left">
                <button type="button" className="btn btn-secondary" onClick={() => append(getEmptyRow(name))}>
                    <FontAwesomeIcon icon={faPlus} /> Add row
                </button>
            </Grid>
        </Grid>
    );
};

const EditForm = ({ itemId, refreshTodoList, layout, apiLink, setShowEdit }) => {

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        setValue,
        trigger,
        getValues,
        reset,
        clearErrors } = useForm(
            {
                mode: 'onBlur',
                reValidateMode: 'onBlur'
            }
        )

    const [options, setOptions] = useState({})
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        layout.forEach((node) => {
            if (node.api) {
                fetchOptions(node)
            }
        })
        refresh()
    }, [itemId])

    const refresh = async () => {
        setLoading(true);
        if (itemId) {
            const response = await fetch(`http://localhost:8000/api/${apiLink}/${itemId}/`)
            const data = await response.json()
            layout.map((node) => {
                if (node.type === 'date') {
                    data[node.key] = new Date(data[node.key]).toISOString().slice(0, 10)
                }
            })
            reset(data)
        } else {
            const data = layout.reduce((acc, node) => {
                switch (node.type) {
                    case "text":
                        acc[node.key] = ""
                        break
                    case "number":
                        acc[node.key] = 0
                        break
                    case "date":
                        acc[node.key] = null
                        break
                    case "checkbox":
                        acc[node.key] = false
                        break
                    case "foreignKeySelect":
                        acc[node.key] = ""
                        break
                    default:
                        acc[node.key] = null
                }
                return acc;
            }, {});
            reset(data)
        }
        setLoading(false);
    }

    const fetchOptions = async (node) => {
        setLoading(true);
        const response = await fetch(`http://localhost:8000//api/${node.api.link}/`);
        const data = await response.json();
        setOptions(prevOptions => ({
            ...prevOptions,
            [node.api.key]: data
        }));
        setLoading(false);
    }

    const handleForeignKeyOptionChange = (event, node) => {
        setValue(node.key, event.target.value);
      };
    

    const renderNode = (node, nodeIndex) => {
        const {type, validation, size} = node
        let element;

        if (["text", "number", "date"].includes(type)) {
            element = (
                <CustomInput
                    node={node}
                    register={register}
                    required
                    errors={errors}
                    validation={validation}
                />
            );
        } else if (type === "checkbox") {
            element = (
                <CustomCheckbox
                    label={node.label}
                    register={register}
                    validation={validation}
                />
            );
        } else if (type === "foreignKeySelect") {
            element = (
                <CustomSelect
                    node={node}
                    register={register}
                    errors={errors}
                    options={options?.[node.api.key] ?? []}
                    optionTitle="title"
                    handleChange={handleForeignKeyOptionChange}
                    validation={validation}
                />
            );
        } else if (node.type === "tableComponent") {
            element = (
                <TableComponent
                    control={control}
                    register={register}
                    errors={errors}
                    name={node.collection}
                    columns={node.columns}
                    setValue={setValue}
                    itemId={itemId}
                />
            );
        } else {
            element = null;
        }

        return (
            <Grid key={nodeIndex} size={size}>
                {element}
            </Grid>
        );
    }

    const onSubmit = async (data) => {
        console.log(data)
        try {
            if (data.id) {
                await axios.put(`http://localhost:8000/api/${apiLink}/${itemId}/`, data);
                // refreshTodoList();
                setShowEdit(false); // Закрыть форму после успешного обновления
            } else {
                await axios.post(`http://localhost:8000/api/${apiLink}/`, data);
                // refreshTodoList();
            }
        } catch (error) {
            console.error("Error submitting item:", error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={1}>
                        {layout.map((node, nodeIndex) => renderNode(node, nodeIndex))}
                    </Grid>
                </Box>
                <div className="d-flex justify-content-center mt-3">
                    <button className="mt-2 w-50 center-block btn btn-success"> Submit </button>
                </div>
            </form>
            <DevTool control={control} />
        </>
    )
}

export default EditForm