import { useEffect, useRef, useState } from 'react';

export const useDebouncedSave = (data, delay = 1000, key = 'caria_cms_autosave') => {
    const [status, setStatus] = useState('saved');
    const [lastSaved, setLastSaved] = useState(null);
    const timerRef = useRef(null);
    const firstRender = useRef(true);

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        setStatus('dirty');

        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setStatus('saving');
            try {
                localStorage.setItem(key, JSON.stringify(data));
                setStatus('saved');
                setLastSaved(new Date().toLocaleTimeString('tr-TR'));
            } catch (err) {
                console.error('Autosave failed:', err);
                setStatus('error');
            }
        }, delay);

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [data, delay, key]);

    return { status, lastSaved, setStatus };
};
