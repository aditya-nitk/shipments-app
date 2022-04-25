type FetchRequestConfig = {
    method: string,
    body: string,
    headers?: {
        [key: string]: string
    }
}

const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

export const fetcher = (url: string, config: FetchRequestConfig) => {
    return fetch(url, { headers: defaultHeaders, ...config }).then(async (res) => {
        let payload;
        try {
            if (res.status === 204) return null; // 204 does not have body
            payload = await res.json();
        } catch (e) {
            /* noop */
        }
        if (res.ok) {
            return payload;
        } else {
            return Promise.reject(payload.error || new Error('Something went wrong'));
        }
    });
};