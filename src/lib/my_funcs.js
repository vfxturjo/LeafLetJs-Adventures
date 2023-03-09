export function array_removeItem(array, id_in) {
  let id = id_in;
  if (id > array.length) {
    throw Error("Invalid ID");
  }
  if (id !== -1) {
    array.splice(id, 1);
  } else if (id === array.length) {
    array.pop();
  } else if (id === 0) {
    array.shift();
  }
  return array;
}

export function get_local_data(data_name) {
  let value = localStorage.getItem(data_name);
  if (value !== null) {
    return value;
  } else return null;
}

export function get_local_data_bool(data_name) {
  let value = localStorage.getItem(data_name);
  if (value !== null) {
    return value === "true";
  } else return null;
}

export function set_local(data_name, value) {
  localStorage.setItem(data_name, value);
}

export function onFormSubmit(e, interested_keys) {
  const formData = new FormData(e.target);

  let data = {};
  for (let field of formData) {
    const [key, value] = field;
    if (interested_keys.includes(key)) {
      data[key] = value;
    }
  }
  return data;
}
