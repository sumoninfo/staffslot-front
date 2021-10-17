import $ from 'jquery'

export const defineBootstrapPlugin = async pluginStr => {
  if ($) {
    const obj = await import('bootstrap')
    const name = obj[pluginStr].NAME
    const JQUERY_NO_CONFLICT = $.fn[name]
    $.fn[name] = obj[pluginStr].jQueryInterface
    $.fn[name].Constructor = obj[pluginStr]
    $.fn[name].noConflict = () => {
      $.fn[name] = JQUERY_NO_CONFLICT
      return obj[pluginStr].jQueryInterface
    }
  }
}
