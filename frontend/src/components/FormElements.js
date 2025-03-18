import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import 'bootstrap/dist/css/bootstrap.min.css';


const CustomInput = ({ node, register, errors, validation }) => {
    const {label, key, type} = node
    const input_id = `invoice-${key}`
    if (validation.required) {
        validation.required = `поле ${label} должно быть заполнено!`
    }
    if (validation.minLength) {
        validation.minLength = {
            value: validation.minLength,
            message: `поле ${label} должно содержать не менее 5 символов!`
        };
    }

    return (
        <>
            <div className="form-group">
                <label className="control-label" htmlFor={input_id}>{label}</label>
                <OverlayTrigger
                    key={input_id}
                    placement="bottom"
                    overlay={errors?.[key] 
                        ? <Tooltip id={`tooltip-${input_id}`}>{errors?.[key]?.message}</Tooltip> 
                        : <></>}
                >
                    <input type={type} id={input_id}
                        className={`form-control ${errors?.[key] ? 'is-invalid' : ''
                            }`}
                        {...register(key, validation)} />
                </OverlayTrigger>
            </div>
        </>
    )
}

const CustomSelect = ({ node, register, errors, options, optionTitle, handleChange, validation }) => {
    const {label, key} = node
    const element_id = `invoice-${key}`
    return (
        <>
            <div className="form-group">
                <label className="control-label" htmlFor={element_id}>{label}</label>
                <OverlayTrigger
                    key={element_id}
                    placement="bottom"
                    overlay={errors?.[key]
                        ? <Tooltip id={`tooltip-${element_id}`}>{errors?.[key]?.message}</Tooltip>
                        : <></>}
                >
                    <select
                        id={element_id}
                        className={`form-control ${errors?.[key] ? 'is-invalid' : ''}`}
                        {...register(key, validation)}
                        onChange={(e) => handleChange(e,node)}
                    >
                        <option value="">Select customer</option>
                        {options.map((item, i) => (
                            <option key={item.id} value={item.id}>{item[optionTitle]}</option>
                        ))}
                    </select>
                </OverlayTrigger>
            </div>
        </>)
}

const CustomCheckbox = ({ label, register }) => (
    <>
        <div className="form-check">
            <input className="form-check-input" type="checkbox" {...register(label)} id={`todo-${label}`}>
            </input>
            <label className="form-check-label" htmlFor={`todo-${label}`}>
                {label}
            </label>
        </div>
    </>
)

const CustomTableInput = ({ register, type, tableName, rowIndex, columnName }) => (
    <input className="form-control" type={type} id={`${tableName}-${rowIndex}-${columnName}`} {...register(`${tableName}.${rowIndex}.${columnName}`)} />
)

const CustomTableForeignKeySelect = ({ register, errors, tableName, rowIndex, columnName, handleChange, options, optionTitle }) => {
    const element_id = `${tableName}-${rowIndex}-${columnName}`
    const validation_rules = { validate: (v) => v !== '---' || `поле ${columnName} не заполнено!` }
    return (
        <>
            <OverlayTrigger
                key={element_id}
                placement="bottom"
                overlay={errors?.[tableName]?.[rowIndex]?.[columnName] 
                        ? <Tooltip id={`tooltip-${element_id}`}>{errors?.[tableName]?.[rowIndex]?.[columnName]?.[optionTitle].message}</Tooltip> 
                        : <></>}
            >
                <select
                    id={element_id}
                    className={`form-control ${errors?.[tableName]?.[rowIndex]?.[columnName]?.[optionTitle] ? 'is-invalid' : ''}`}
                    {...register(`${tableName}.${rowIndex}.${columnName}.${optionTitle}`, validation_rules)}
                    onChange={(e) => handleChange(e, rowIndex)}
                >
                    {options.map((item) => (
                        <option key={item.id} value={item[optionTitle]}>{item[optionTitle]}</option>
                    ))}
                </select>
            </OverlayTrigger>
        </>)
}

const CustomTableSelect = ({ register, errors, tableName, rowIndex, columnName, options }) => {
    const element_id = `${tableName}-${rowIndex}-${columnName}`
    const validation_rules = { validate: (v) => v !== '---' || `поле ${columnName} не заполнено!` }
    return (
        <>
            <OverlayTrigger
                key={element_id}
                placement="bottom"
                overlay={errors?.[tableName]?.[rowIndex]?.[columnName] ? 
                        <Tooltip id={`tooltip-${element_id}`}>{errors?.[tableName]?.[rowIndex]?.[columnName].message}</Tooltip> 
                        : <></>}
            >
                <select
                    id={element_id}
                    className={`form-control ${errors?.[tableName]?.[rowIndex]?.[columnName] ? 'is-invalid' : ''}`}
                    {...register(`${tableName}.${rowIndex}.${columnName}`, validation_rules)}
                >
                    {options.map((item, i) => (
                        <option key={i} value={item}>{item}</option>
                    ))}
                </select>
            </OverlayTrigger>
        </>)
}


export {CustomInput, CustomCheckbox, CustomTableInput, CustomTableForeignKeySelect, CustomTableSelect, CustomSelect}