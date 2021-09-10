import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';

const components = {
    DropdownIndicator: null,
};

const createOption = (label) => ({
    label,
    value: label,
});

export default class CreatableInputOnly extends Component {
    state = {
        inputValue: '',
        value: [],
    };

    static getDerivedStateFromProps(props, state) {
        if (props.ingredients) {
            return {
                value: props.ingredients,
            }
        }

        return state;
    }

    handleChange = (value, actionMeta) => {
        this.setState({ value });
        this.props.handleIngredientRemoved({ value })
    };

    handleInputChange = (inputValue) => {
        this.setState({ inputValue });
    };

    handleKeyDown = (event) => {
        const { inputValue, value } = this.state;
        if (!inputValue) return;
        switch (event.key) {
            case 'Enter':
            case 'Tab':
                this.setState({
                    inputValue: '',
                    value: [...value, createOption(inputValue)],
                });
                event.preventDefault();
                this.props.handleIngredientAdded({ inputValue, value })
                break;
            default:

        }
    };
    render() {
        const { inputValue, value } = this.state;
        return (
            <div data-testid="ingredients-entry">
                <CreatableSelect
                    components={components}
                    inputValue={inputValue}
                    isClearable
                    isMulti
                    menuIsOpen={false}
                    onChange={this.handleChange}
                    onInputChange={this.handleInputChange}
                    onKeyDown={this.handleKeyDown}
                    placeholder="Type something and press enter..."
                    value={value}
                />
            </div>
        );
    }
}