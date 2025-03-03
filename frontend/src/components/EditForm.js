import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form"
import { DevTool } from '@hookform/devtools'
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { CustomInput, CustomCheckbox, CustomTableInput, CustomTableForeignKeySelect, CustomTableSelect } from './FormElements'
// import Grid from '@mui/material/Grid';
import { Grid2 } from '@mui/material';

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

    useEffect(() => {
        refresh()
    }, [itemId])

    const refresh = async () => {
        if (itemId) {
            const response = await fetch(`http://localhost:8000/api/${apiLink}/${itemId}/`)
            const data = await response.json()
            layout.map((node) => {
                if (node.inputType==='date') {
                    data[node.key] = new Date(data[node.key]).toISOString().slice(0, 10)
                }
            })
            reset(data)
        } else {
            const response = await fetch(`/api/${apiLink}/empty_template/`)
            const data = await response.json()
            console.log(data)
            reset(data)
        }
    }

    const renderNode = (node, nodeIndex) => {
        let element;

        switch (node.type) {
            case 'input':
                element = (
                    <CustomInput
                        node = {node}
                        register={register}
                        required
                        errors={errors}
                        validation={node.validation} />
                );
                break;
            case 'checkbox':
                element = (
                    <CustomCheckbox
                        label={node.label}
                        register={register}
                        validation={node.validation} />
                );
                break;
            case 'tableComponent':
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
                break;
            default:
                element = null;
        }

        return (
            <Grid key={nodeIndex} item xs={node.size}>
                {element}
            </Grid>
        );
    }

    const onSubmit = (data) => {
        // Handle form submission
        if (data.id) {
            axios
                .put(`/api/todos/${data.id}/`, data)
                .then((res) => {
                    refreshTodoList()
                    setShowEdit(false); // Закрыть форму после успешного обновления
                })
                .catch((error) => {
                    // Handle PUT request error
                    console.error("Error updating item:", error)
                });
            return;
        }

        axios
            .post("/api/todos/", data)
            .then((res) => {
                refreshTodoList()
            })
            .catch((error) => {
                // Handle POST request error
                console.error("Error creating item:", error)
            });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <Grid container spacing={1}>
                    {layout.map((node, nodeIndex) => renderNode(node, nodeIndex))}
                </Grid>
                <div className="d-flex justify-content-center">
                    <button className="mt-2 w-50 center-block btn btn-success"> Submit </button>
                </div>
            </form>
            <DevTool control={control} />
        </>
    )
}

export default EditForm