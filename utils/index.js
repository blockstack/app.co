import map from 'lodash/map'
import lodashDefaults from 'lodash/defaults'
import find from 'lodash/find'
import React from 'react'
import Select from '@atlaskit/select'
import moment from 'moment'

const colorHexFromString = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += `00${value.toString(16)}`.substr(-2)
  }
  return colour
}

const truncate = (str, options) => {
  const defaults = {
    after: '...',
    length: 50
  }

  const opts = lodashDefaults(options, defaults)

  if (str.length > opts.length) {
    return str.slice(0, opts.length - opts.after.length) + opts.after
  }
  return str
}

const outboundLink = (app, link) => {
  if (typeof gtag !== 'undefined') {
    gtag('event', 'outgoing_click', {
      event_label: app.name,
      event_category: 'Apps',
      app_name: app.name,
      app_id: app.id,
      url: link || app.website
    })
  }
  window.open(link || app.website, '_blank')
}

const trackPageView = (path) => {
  if (typeof 'gtag' !== 'undefined') {
    gtag('config', 'UA-119163063-1', {
      page_path: path || document.location.pathname,
      page_title: document.title
    })
  }
}

const trackEvent = (action, opts) => {
  if (typeof 'gtag' !== 'undefined') {
    gtag('event', action, opts)
  }
}

const customEventWithDefaults = (action) =>
  trackEvent(action, {
    page_path: document.location.pathname,
    page_title: document.title
  })

const enumSelect = (enums, placeholder, props = {}) => {
  const options = map(enums, (opt) => ({ label: opt, value: opt }))
  if (!props.required) {
    options.push({ label: 'None', value: '' })
  }
  const onChange = (option) => {
    props.onChange({ [props.apiAttr || placeholder.toLowerCase()]: option.value })
  }
  const value = props.value ? { label: props.value, value: props.value } : null
  return (
    <div>
      <h3>{placeholder}</h3>
      <br />
      <Select
        options={options}
        placeholder={placeholder}
        className="react-select"
        onChange={onChange}
        isSearchable={false}
        value={value}
        menuPlacement={props.menuPlacement || 'bottom'}
      />
      <br />
    </div>
  )
}

const appRoute = (app) => {
  const slug = app.Slugs[0]
  return `/app/${slug ? slug.value : app.id}`
}

const appStatuses = [
  { label: 'Pending Audit', value: 'pending_audit' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Accepted', value: 'accepted' }
]

const appStatusFromValue = (value) => find(appStatuses, (status) => status.value === value)

const capitalize = (lower) => lower.charAt(0).toUpperCase() + lower.substr(1)

const getTags = (app) => {
  const tags = []

  if (app.authentication) {
    tags.push(app.authentication)
  }

  if (app.blockchain) {
    tags.push(app.blockchain)
  }

  if (app.storageNetwork) {
    tags.push(app.storageNetwork)
  }

  return Array.from(new Set(tags))
}

const properTagFromParam = (param, enums) =>
  enums.find((platform) => platform.toLowerCase() === param) || capitalize(param)

const slugifyCategory = (category) => category.toLowerCase().replace(' ', '-')

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

const getTwitterMentions = (app) => {
  const [ranking] = app.Rankings
  if (ranking) {
    return ranking.twitterMentions || 0
  }
  return 0
}

const monthName = (month) => {
  const date = moment(`${month.month} ${month.year}`, 'M YYYY')
  return date.format('MMMM YYYY')
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const getDecimalPlaces = (value) => {
  if(Math.floor(value) === value) return 0;
  return value.toString().split(".")[1].length || 0;
}

export {
  appRoute,
  appStatuses,
  appStatusFromValue,
  capitalize,
  colorHexFromString,
  enumSelect,
  getDecimalPlaces,
  getRandomInt,
  getTags,
  getTwitterMentions,
  monthName,
  outboundLink,
  properTagFromParam,
  slugify,
  slugifyCategory,
  trackEvent,
  trackPageView,
  truncate
}
