/**
 *  BLOCK: Blog Category
 *  ---
 *
 */

// Used to make item ids
import {nanoid} from 'nanoid'

const {__} = wp.i18n
const {registerBlockType} = wp.blocks
const {InspectorControls, MediaUpload, MediaUploadCheck, RichText} = wp.blockEditor
const {Button, PanelBody, PanelRow, ToggleControl} = wp.components
const {Component} = wp.element
registerBlockType('davidyeiser-detailer/blog-category', {
    title: __('Blog Category'),
    icon: 'format-aside',
    category: 'common',
    keywords: [
        __('blog'),
        __('category'),
    ],

    // Enable or disable support for low-level features
    supports: {
        // Turn off ability to edit HTML of block content
        html: false,
        // Turn off reusable block feature
        reusable: false,
        // Add alignwide and alignfull options
        align: false
    },

    // Set up data model for custom block
    attributes: {
        image: {
            type: 'object',
            selector: 'js-book-details-image'
        },
        categories: {
            type: 'array',
            selector: '',
        },
        title: {
            type: 'string',
            selector: 'js-book-details-title'
        },
        author: {
            type: 'string',
            selector: 'js-book-details-author'
        },
        category: {
            type: 'string',
            selector: '',
        },
        summary: {
            type: 'string',
            selector: 'js-book-details-summary',
            multiline: 'p'
        },
        haveRead: {
            type: 'boolean',
            selector: 'js-book-details-read'
        },
        quotes: {
            type: 'array',
            selector: 'js-book-details-quotes'
        }
    },

    // The UI for the WordPress editor
    edit: class BookDetails extends Component {
        constructor() {
            super(...arguments)

            // Match current state to saved quotes (if they exist)
            this.state = {
                quotes: this.props.attributes.quotes || [],
                categories: this.props.attributes.categories || [],
                loading: false,
            }

            this.addQuote = this.addQuote.bind(this)
            this.removeQuote = this.removeQuote.bind(this)
            this.editQuote = this.editQuote.bind(this)
        }

        componentDidMount() {
            wp.apiFetch({
                path: '/wp/v2/categories',
                method: 'GET'
            })
                .then(cats => {
                    const categories = [
                        ...cats
                    ]
                    this.props.setAttributes({categories: {categories}},)
                })
                .catch(() => {
                    this.setState({loading: false})
                })
        }

        // adds empty placeholder for quote
        addQuote(e) {
            e.preventDefault()

            // get quotes from state
            const {quotes} = this.state

            // set up empty quote
            const emptyQuote = {
                id: nanoid(),
                content: '',
                pageRef: ''
            }

            // append new emptyQuote object to quotes
            const newQuotes = [...quotes, emptyQuote]

            // save new placeholder to WordPress
            this.props.setAttributes({quotes: newQuotes})

            // and update state
            return this.setState({quotes: newQuotes})
        }

        // remove item
        removeQuote(e, index) {
            e.preventDefault()

            // make a true copy of quotes
            // const { quotes } = this.state does not work
            const quotes = JSON.parse(JSON.stringify(this.state.quotes))

            // remove specified item
            quotes.splice(index, 1)

            // save updated quotes and update state (in callback)
            return (
                this.props.setAttributes(
                    {quotes: quotes},
                    this.setState({quotes: quotes})
                )
            )
        }

        // handler function to update quote
        editQuote(key, index, value) {
            // make a true copy of quotes
            const quotes = JSON.parse(JSON.stringify(this.state.quotes))
            if (quotes.length === 0) return

            // update value
            quotes[index][key] = value

            // save values in WordPress and update state (in callback)
            return (
                this.props.setAttributes(
                    {quotes: quotes},
                    this.setState({quotes: quotes})
                )
            )
        }

        showCategories() {
            const category = this.props.attributes.category;
            const categories = this.props.attributes.categories;
            return categories && categories.categories.map((cat) => {
                return (<option selected={category === cat.slug} value={cat.slug}>{cat.name}</option>)
            })
        }

        handleChange(event) {
            // this.setState({ category: event.target.value })
            this.props.setAttributes({category: event.target.value})
        }

        render() {
            // Pull out the props we'll use
            const {attributes, className, setAttributes} = this.props

            // Pull out specific attributes for clarity below
            const {categories} = attributes
            // this.getPlot();

            if (!categories) {
                return false;
            }

            return (
                <div className={className}>
                    <h6>Select category from your blog below:</h6>
                    <select onChange={(event) => this.handleChange(event)}>
                        {this.showCategories()}
                    </select>
                </div>
            )
        }
    },
    // No save, dynamic block
    save: props => {
        return null
    },
    withSelect: sel => {
        console.log("SELECTED", sel);
    }
})
