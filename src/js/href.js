import Model from "./model";
import $ from "jquery";
import {Event} from "./event";
import Data from "./data";

export default class Href extends URL
{

    /**
     * Split searchParams keys to parent_id, keys
     * @param {string} key
     * @returns {[]}
     */
    static split(key)
    {
        return key.split(Data.separator()); // array[0]: id, array[1]: property
    }

    constructor() {
        let href = window.location.href;
        super(href);
    }
    async get()
    {
        return this.data
    }
    get data()
    {
        let result = new Data();
        for (let [key, v] of this.searchParams)
        {
            let k = Href.split(key);
            let id = k[0];
            let prop = (k[1]!== '' && typeof k[1] !== 'undefined')
                ? k[1]
                : "default";
            result.import(id, prop, v);
        }
        return result.get();
    }

    /**
     *
     * @param {Map} map
     */
    set data(map)
    {
        if (map instanceof "Map")
        {
            for (let [id, m] of map)
            {
                for (let [k, v] of m)
                {
                    let key = id + Data.separator() + k;
                    this.query = [key, v];
                }
            }
        }
    }
    get query()
    {
        let result = new Map();
        this.searchParams.forEach(
            function (value, key, parent)
            {
                result.set(key,value);
            }
        );
        console.log(result);
        return result;
    }

    /**
     *
     * @param {$Keys,$Values} map
     */
    set query(map)
    {
        map.forEach((value, key) =>
        {
            this.searchParams.append(key, value);
            console.log("query updated: "+key+" => "+value);
        });
        this.string = this.search;
    }

    async replaceWith(str) {
      window.history.replaceState(
              "",
              "",
              `${this.pathname}${str}`
      );
    }
    set string(str)
    {
        this.replaceWith(str).then(
            Event.trigger('url_change')
        );
    }
    static encode(queryString)
    {
        return `#${btoa(queryString)}`;
    }
    static decode(hashString)
    {
        return atob(hashString.slice(1));
    }
    tinyUrl() {
        let share = this.origin + this.pathname + this.search;
        $.get(`https://tinyurl.com/api-create.php?url=${share}`, function(shorturl){
            $("#tinyurl-button").addClass("is-hidden");
            $("#tinyurl-result i").text(shorturl);
            $("#tinyurl-result").removeClass("is-hidden");
            console.log(shorturl);
        });
    }
}