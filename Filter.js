import React, { Component } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

class Filter extends Component {
    constructor(props) {
        super(props)


        this.state = {
            data: [],
            filterBy: {},
            nestedObjectFilterBy: {},
            nestedObjectArrayFilterBy: {},
            ready_data: []
        }
    }

    componentDidMount() {
        const { data, filterBy, nestedObjectFilterBy, nestedObjectArrayFilterBy } = this.props
        this.setState({
            data: [ ...data ],
            filterBy: { ...filterBy },
            nestedObjectFilterBy: { ...nestedObjectFilterBy },
            nestedObjectArrayFilterBy: { ...nestedObjectArrayFilterBy },
            ready_data: [ ...data ]
        })
    }

    handleChange = (e) => {
        const value = e.target.value
        const { data, filterBy, nestedObjectFilterBy, nestedObjectArrayFilterBy } = this.state
        const keys = Object.keys(filterBy) //ARRAY - equals to keys of types that we want search through
        const keys_nested_target = Object.keys(nestedObjectFilterBy.target)
        const keys_nested_types = Object.keys(nestedObjectFilterBy.types)

        const keys_nested_array_target = Object.keys(nestedObjectArrayFilterBy.target)
        const keys_nested_array_types = Object.keys(nestedObjectArrayFilterBy.types)


        let new_data = []
        for (var a = 0; a < data.length; a++) {
            const data_item = data[a] //OBJECT with all of different properies from data array
            const keys_data_item = Object.keys(data_item)
            
            let contains = false
            for (var b= 0; b < keys.length; b++) {
                var key = keys[b] //SINGLE - equals to values type: id, email, etc.

                switch(_.lowerCase(filterBy[key])){
                    case 'string':
                        if(keys_data_item.indexOf(key) !== -1){
                            const lower = _.toLower(data[a][key].toString())
                            const key_to_lower = _.toLower(value)
                            if(lower.includes(key_to_lower)){
                                contains = true
                            }    
                        }
                        break
                    case 'number':
                        break
                    case 'date':
                        break
                }
            }


            ///nested object search
            for (var c = 0; c < keys_nested_target.length; c++) {
                var target_key = keys_nested_target[c]
                
                const nested_array_keys = Object.keys(typeof(data[a][target_key]) !== 'undefined' ? data[a][target_key] : {})

                const something = data[a][target_key]

                for (var d = 0; d < nested_array_keys.length; d++) {
                    var nested_key = nested_array_keys[d]

                    if(keys_nested_types.indexOf(nested_key) !== -1){
                        // const lower = _.toLower()

                        const lower = _.toLower(data[a][target_key][nested_key].toString())
                        const key_to_lower = _.toLower(value)
                        if(lower.includes(key_to_lower)){
                            contains = true
                        }
                    }
                }
            }

            //nested object array search
            for (var e = 0; e < keys_nested_array_target.length; e++) {
                var target_key = keys_nested_array_target[e];
                
                const nested_array_object = typeof(data_item[target_key]) !== 'undefined' ? data_item[target_key] : {}
                const keys_nested_array_object = Object.keys(nested_array_object)

                for (var f = 0; f < keys_nested_array_object.length; f++) {
                    var key_of_nested_element_array = nested_array_object[f]

                    for (var g = 0; g < keys_nested_array_types.length; g++) {
                        var type_key = keys_nested_array_types[g];

                        const lower = _.toLower(nested_array_object[keys_nested_array_object[f]][type_key].toString())
                        const key_to_lower = _.toLower(value)
                        if(lower.includes(key_to_lower)){
                            contains = true
                        }
                    }
                }
            }


            if(contains){
                new_data.push({ ...data[a] })
            }
        }


        
        console.log(new_data)
        this.setState({ ready_data: [ ...new_data ] })
    }


    render() {
        return (
            <div>
                <input type="text" placeholder="" onChange={this.handleChange} autoFocus/>
                <ul>
                {
                    this.state.ready_data.map( (item, index) => 
                    <li key={index}>
                        <p>id: {item.guid},  <br/>
                            age: <b>{item.age}</b>,  <br/>
                            email: {item.email},  <br/>
                            <b>since: {item.registered}</b>,  <br/>
                            eyes: {item.eyeColor}
                        </p>
                    </li>
                    )
                }
                </ul>
            </div>
        );
    }
}

Filter.propTypes = {
    data: PropTypes.array,
    filterBy: PropTypes.object
}


export default Filter




// <Filter data={dummy.data}
// filterBy={{
//   guid: 'string',
//   age: 'number',
//   email: 'string',
//   registered: 'date',
//   eyeColor: 'string',
//   gender: 'string',
//   age: 'string'
// }}

// nestedObjectFilterBy={{
//   target: {
//     customer: 'object',
//     db: 'object'
//   },
//   types: {
//     name:'string',
//     isActive: 'bool',
//     derp: 'string'
//   }
// }}

// nestedObjectArrayFilterBy={{
//   target: {
//     assets: 'object',
//     lulz: 'object'
//   },
//   types: {
//     make: 'string'
//   }
// }}
// />  